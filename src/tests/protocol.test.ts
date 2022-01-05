import protocol, { RespResponse } from "../protocol";

describe("Test the Potocol Parser!", () => {

  it("Test Simple string", () => {
    const parsed = protocol.parse(Buffer.from("+I am a string!\r\n"));
    expect(parsed.length).toBe(1);
    expect((parsed[0] as RespResponse).content).toBe("I am a string!");
  });

  it("Test Essential OK string", () => {
    const parsed = protocol.parse(Buffer.from("+OK\r\n"));
    expect(parsed.length).toBe(1);
    expect((parsed[0] as RespResponse).content).toBe("OK");
  });

  it("Test integer", () => {
    const parsed = protocol.parse(Buffer.from(":1999\r\n"));
    expect(parsed.length).toBe(1);
    expect((parsed[0] as RespResponse).content).toBe(1999);
  });

  it("Test bulk strirng", () => {
    const parsed = protocol.parse(Buffer.from("$15\r\nHi, I am Bruce!\r\n"));
    expect(parsed.length).toBe(1);
    expect((parsed[0] as RespResponse).contentType).toBe("bulkstring");
    expect((parsed[0] as RespResponse).content).toBe("Hi, I am Bruce!");
  });  
 
  it("Test Error", () => {
    const parsed = protocol.parse(Buffer.from("-WRONGTYPE Operation against a key holding the wrong kind of value\r\n"));
    expect(parsed.length).toBe(1);
    expect((parsed[0] as RespResponse).contentType).toBe("error");
    expect((parsed[0] as RespResponse).content).toStrictEqual({
      tag: 'WRONGTYPE',
      msg: 'Operation against a key holding the wrong kind of value',
    });
  });   

  it("Test Array", () => {
    const parsed = protocol.parse(Buffer.from("*5\r\n:1\r\n:2\r\n:3\r\n:4\r\n$6\r\nfoobar\r\n"));
    expect(parsed.length).toBe(1);
    expect((parsed[0].content as Array<RespResponse>).length).toBe(5);
    expect((parsed[0].content as Array<RespResponse>)[4].contentType).toBe("bulkstring");
  });  

  it("Test nested array", () => {
    const buffer = `*6\r\n:1\r\n:2\r\n:3\r\n:4\r\n$6\r\nfoobar\r\n*2\r\n+str1\r\n$5\r\nhello\r\n`;
    const parsed = protocol.parse(Buffer.from(buffer));
    expect(parsed.length).toBe(1);
    expect(((parsed[0].content as RespResponse[])[5].content as RespResponse[])[1].content).toBe('hello');
  });

  it("Test multi response", () => {
    const buffer = `:1\r\n:2\r\n:3\r\n:4\r\n$6\r\nfoobar\r\n*2\r\n+str1\r\n$5\r\nhello\r\n`;
    const parsed = protocol.parse(Buffer.from(buffer));
    expect(parsed.length).toBe(6);
    expect((parsed[5].contentType)).toBe("array");
    expect((parsed[5].content as RespResponse[])[1].content).toBe("hello");
  });

})

describe("Test encoding", () => {
  
  it("Basic encoding", () => {
    const encoded = protocol.encode(["get", "name1"]);
    expect(encoded).toBe("*2\r\n$3\r\nget\r\n$5\r\nname1\r\n");
  });

  it("Number encoding", () => {
    const encoded = protocol.encode(["incrby", "counter1", "19999"]);
    expect(encoded).toBe("*3\r\n$6\r\nincrby\r\n$8\r\ncounter1\r\n$5\r\n19999\r\n");
  });

})