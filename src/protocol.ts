/**
 * The protocol implemenation as per the specification from Redis.
 * URL: https://redis.io/topics/protocol
 */


export type RedisError = {
  /**
   * The first CAP letters tagging what the error is, e.g. ERR, WRONGTYPE, etc.
   */
  tag: string;

  /**
   * The message of the error, the part after the "tag".
   */
  msg: string;
}

/**
 * Type of the Array element, it could be an Error, a number, a string/bulk string, a null string, or another nested array.
 */
export type RespArrayElement = RedisError | number | string | null | Array<RespArrayElement>;

/**
 * Some tag to identify which type the content type is.
 */
export type RespContentType = "error" | "string" | "integer" | "bulkstring" | "array" | "null";

export type RespResponse = {
  contentType: RespContentType;
  content: RespArrayElement | Array<RespResponse>;
}

function parse(data: Buffer): Array<RespResponse> {
  if (!data) return [];
  if (data.length < 1) return [];

  let rootArray: Array<RespResponse> = [];
  let currArray: Array<RespResponse> = rootArray;
  let currArrayIdx: number = 0;

  let arrayStack: Array<Array<RespResponse>>  = [];
  let arrayIdxStack: number[] = [];

  const checkIfArrayEnded = () => {
    // The outer most array will not be handled
    if (arrayStack.length > 1) {
      // End current array
      if (currArrayIdx <= 0) {
        const endedArray = currArray;
        currArray = arrayStack.pop() ?? rootArray;
        currArrayIdx = arrayIdxStack.pop() ?? 0;
        pushArray({
          contentType: "array",
          content: endedArray,
        })
      }
    }
  }

  const pushArray = (newItem: RespResponse) => {
    currArray.push(newItem);
    currArrayIdx--;
    checkIfArrayEnded();
  }

  const crlf = new Uint8Array([13, 10]);
  let i = 0;
  while (i < data.length) {
    // Judge the segements by leading char
    switch(String.fromCharCode(data[i])) {
      case '+':
        const idxStrEnd = data.indexOf(crlf, i + 1);
        pushArray({
          contentType: "string",
          content: data.subarray(i + 1, idxStrEnd).toString(),
        })
        i = idxStrEnd + 2;
        break;
      case '-':
        const idxErrorEnd = data.indexOf(crlf, i + 1);
        const errorAll = data.subarray(i + 1, idxErrorEnd).toString();
        pushArray({
          contentType: "error",
          content: {
            tag: errorAll.substring(0, errorAll.indexOf(" ")),
            msg: errorAll.substring(errorAll.indexOf(" ") + 1),
          }
        });
        i = idxErrorEnd + 2;
        break;
      case ':':
        const idxIntEnd = data.indexOf(crlf, i + 1);
        pushArray({
          contentType: "integer",
          content: parseInt(data.subarray(i + 1, idxIntEnd).toString()),
        })
        i = idxIntEnd + 2;
        break;
      case '$':
        const idxBstrLenEnd = data.indexOf(crlf, i + 1);
        const bStrLen = parseInt(data.subarray(i + 1, idxBstrLenEnd).toString());
        if (bStrLen < 0) {
          pushArray({
            contentType: "null",
            content: null,
          })
          i = idxBstrLenEnd + 2;
        } else {
          const idxBstrEnd = data.indexOf(crlf, idxBstrLenEnd + 2);
          currArray.push({
            contentType: "bulkstring",
            content: data.subarray(idxBstrLenEnd + 2, idxBstrLenEnd + 2 + bStrLen).toString(),
          })
          i = idxBstrLenEnd + 2 + bStrLen + 2;
        }
        break;
      case '*':
        const idxArrayEnd = data.indexOf(crlf, i + 1);
        const arrayLen = parseInt(data.subarray(i + 1, idxArrayEnd).toString());
        if (arrayLen === 0) {
          pushArray({
            contentType: "array",
            content: [],
          });
        } else if (arrayLen < 0) {
          pushArray({
            contentType: "null",
            content: null,
          })
        } else {
          // We are starting a new (nesting) array.
          const newArray = [];
          // Push the parent array to stack, and toggle the new to be "current"
          arrayStack.push(currArray);
          arrayIdxStack.push(currArrayIdx);
          currArray = newArray;
          currArrayIdx = arrayLen;
        }
        i = idxArrayEnd + 2;
        break;
      default:
        i++;
    }
  }
  // Fix the un-ended arrays
  if (arrayStack.length > 0) {
    while (arrayStack.length > 0) {
      const endedArray = currArray;
      currArray = arrayStack.pop() ?? [];
      currArray.push({
        contentType: "array",
        content: endedArray,
      });
    }
  }
  return rootArray;
}

export type RespCommand = Array<string | number>;

function encode(command: RespCommand): string {
  if (!command || command.length < 1) return "";
  const cmds = command.map(v => {
    if (typeof v === 'number') {
      const vStr = v.toString();
      return `$${Buffer.byteLength(vStr)}\r\n${vStr}\r\n`;
    } else if (typeof v === 'string') {
      return `$${Buffer.byteLength(v)}\r\n${v}\r\n`;
    } else {
      return `$-1\r\n`
    }
  }).join("");
  return `*${command.length}\r\n${cmds}`;
}

export default {
  encode,
  parse,
}