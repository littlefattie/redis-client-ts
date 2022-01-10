import { createClient } from ".";
import { IRedisClientOptions, ObjFieldValue, ObjInRedis, RedisClient, ZsetCollection } from "./client";
import redisCommands from "./commands";
import protocol from "./protocol";

const createCleint:((options: IRedisClientOptions) => Promise<RedisClient>) = (options: IRedisClientOptions) => {
  return new Promise((resolve, reject) => {
    const client = new RedisClient(options, true, true);
    client.on("error", (err:Error) => {
      reject(`Error happened when creating the client!\nDetail: ${err.message}`);
    });
    client.on("ready", () => {
      console.log(`The client is ready, ID: ${client.id}`);
      resolve(client);
    });
  })
}

const options: IRedisClientOptions = {
    host: 'localhost',
    port: 6379,
  };


const testCounter = async (client: RedisClient) => {
  const c1 = "test_counter1";

  console.log(`--------------- Start Counter Test --------------------------`);
  await client.setCounter(c1, 1789)
    .then(c => {
      console.log(`Counter should be: 1789, right ? ${c === 1789}, returned is ${c}.`);
    })
    .then(() => client.incr(c1))
    .then(c => console.log(`Counter should be: 1790, right ? ${c === 1790}, returned is ${c}.`))
    .then(() => client.incrBy(c1, 23))
    .then(c => console.log(`Counter should be: 1813, right ? ${c === 1813}, returned is ${c}.`))
    .then(() => client.decr(c1))
    .then(c => console.log(`Counter should be: 1812, right ? ${c === 1812}, returned is ${c}.`))
    .then(() => client.getCounter(c1))
    .then(c => console.log(`Counter should be: 1812, right ? ${c === 1812}, returned is ${c}.`))
    .then(() => client.incrBy(c1, -11))
    .then(c => console.log(`Counter should be: 1801, right ? ${c === 1801}, returned is ${c}.`))
    .catch(err => console.log(`Test Error: ${err}`))
    .finally(() =>{
      console.log(`Counter test DONE!`);
      return client.delete(c1);
    });
}

const testHash = async (client: RedisClient) => {
  const testObj: ObjInRedis = {
    name: "萧山红五郎Yes5",
    userID: "UUID866287ABDE8F2B",
    age: 120,
    birthDate: new Date(),
    motto: "I am the king.我是世界之王。",
    occupation: "coder",
  };
  const date2 = new Date((testObj.birthDate as Date).getTime() + 10000);
  const ktest = "testhashobj";

  console.log(`--------------- Start Hash Test --------------------------`);
  await client.setObject(ktest, testObj)
    .then(() => console.log(`Object successfully set!`))
    .then(() => client.getObject(ktest))
    .then(obj => {
      // console.log(obj);
      console.log(`Field Check: name (${testObj.name === obj.name})> original: ${testObj.name} | returned: ${obj.name}`);
      console.log(`Field Check: userID (${testObj.userID === obj.userID})> original: ${testObj.userID} | returned: ${obj.userID}`);
      console.log(`Field Check: age (${testObj.age === obj.age})> original: ${testObj.age} | returned: ${obj.age}`);
      console.log(`Field Check: birthDate (${(testObj.birthDate as Date).getTime() === (obj.birthDate as Date).getTime()})> original: ${(testObj.birthDate as Date).toISOString()} | returned: ${(obj.birthDate as Date).toISOString()}`);
      console.log(`Field Check: motto (${testObj.motto === obj.motto})> original: ${testObj.motto} | returned: ${obj.motto}`);
      console.log(`Field Check: occupation (${testObj.motto === obj.motto})> original: ${testObj.occupation} | returned: ${obj.occupation}`);
    })
    .then(() => client.setHashField(ktest, "age", 99))
    .then(() => console.log(`Set hash field DONE!`))
    .then(() => client.getHashField(ktest, "age"))
    .then(age => console.log(`Field Check: age (${99 === age})> expected: ${99} | returned: ${age}`))
    .then(() => client.setMultipleHashField(ktest, {
        age : 111,
        birthDate: date2,
        motto: "I am the new Motto, 哈哈.",
      }))
    .then(() => console.log(`Set multiple hash fields Done!`))
    .then(() => client.getMultipleHashField(ktest, ["age", "birthDate", "motto"]))
    .then(obj => {
      console.log(`Field Check: age (${111 === obj[0]})> original: ${111} | returned: ${obj[0]}`);
      console.log(`Field Check: BirthDate (${date2.getTime() === (obj[1] as Date).getTime()})> original: ${date2.toISOString()} | returned: ${(obj[1] as Date).toISOString()}`);
      console.log(`Field Check: motto (${"I am the new Motto, 哈哈." === obj[2]})> original: ${"I am the new Motto, 哈哈."} | returned: ${obj[2]}`);
    })
    .then(() => client.getHashFields(ktest))
    .then(fields => {
      const testObjKeys = Object.keys(testObj);
      const fDiffReturned = fields.filter(f => !testObjKeys.includes(f));
      const fDiffObj = testObjKeys.filter(k => !fields.includes(k));
      console.log(`Fields Check: (${fDiffReturned.length === 0 && fDiffObj.length === 0})> testobj: ${testObjKeys.join("|")} | returned: ${fields.join("|")}`);
    })
    .catch(err => console.log(`HASH TEST ERROR: ${err}`))
    .finally(() => {
      console.log(`HASH test DONE!`);
      return client.delete(ktest);
    });
}

const testList = async (client: RedisClient) => {
  const l1 = "testList1";
  const l2 = "testList2";
  const d1 = new Date();
  const d2 = new Date(d1.getTime() + 100000);
  const d3 = new Date(d1.getTime() + 33333);
  const testList: ObjFieldValue[] = [1,2,3, 'a', 'b', 'c', d1, 'e', 'f', d2, d3];
  const tl2: ObjFieldValue[] = ['u', 'v', d3, 'xxx'];
  console.log(`--------------- Start List Test --------------------------`);
  await client.writeList(l1, testList)
    .then(() => console.log(`List written to list "${l1}`))
    .then(() => client.readList(l1))
    .then(list => {
      for (let i = 0; i < testList.length; i++) {
        if (list[i] instanceof Date) {
          console.log(`Date Field Check at ${i} : ${(list[i] as Date).getTime() === (testList[i] as Date).getTime()} 
            -> expected: ${(testList[i] as Date).toISOString()} | got: ${list[i]}`);
        } else {
          console.log(`Field check at ${i}: ${list[i] === testList[i]} -> expected: ${testList[i]} | got: ${list[i]}`);
        }
      }
    })
    .then(() => client.getListItemAt(l1, 6))
    .then(res => {
      console.log(`Element check: ${res instanceof Date && (res as Date).getTime() === d1.getTime()} 
          -> Expected: ${d1.toISOString()} | got: ${res}`);
    })
    .then(() => client.setListItemAt(l1, 'newItem', 6))
    .then(() => client.getListItemAt(l1, 6))
    .then(res => {
      console.log(`Set List at Index Check: ${res === 'newItem'} -> Expected : ${"newItem"} | got: ${res}`);
    })
    .then(() => client.removeListItemAt(l1, 6))
    .then(() => client.readList(l1))
    .then(list => {
      console.log(`Length of new List should be ${testList.length - 1}, actual: (${list.length}), [${list.length === testList.length - 1}]`);
      console.log(list);
    })
    .then(() => client.addToList(l1, tl2, "append"))
    .then(() => client.readList(l1))
    .then(list => console.log(list))
    .then(() => client.addToList(l1, tl2, "prepend"))
    .then(() => client.readList(l1))
    .then(list => console.log(list))
    .then(() => client.addToList(l1, tl2, "atindex", tl2.length + 3))
    .then(() => client.readList(l1))
    .then(list => console.log(list))
    .then(() => client.addToList(l1, tl2, "atindex", -2))
    .then(() => client.readList(l1))
    .then(list => console.log(list))
    .then(() => client.findItemInList(l1, "xxx"))
    .then(pos => console.log(pos))
    .catch(err => console.log(`List Test Error: ${err}`))
    .finally(() => {
      console.log("List test DONE!");
      return client.delete(l1);
    })
}

const testSet = async (client: RedisClient) => {
  const sk1 = "testSet1";
  const s1: (string | number)[] = ['a', 'b', 'c', 'yes', 3, 5, 7, 'hello', 7];

  console.log(`--------------- Start Set Test --------------------------`);
  await client.addToSet(sk1, s1)
    .then(() => client.getSetItems(sk1))
    .then(items => {
      // There is duplicated item (7)
      console.log(`Set numbers right? ${items.length === s1.length - 1}`);
      console.log(s1);
      console.log(items);
    })
    .then(() => client.removeItemsFromSet(sk1, ['a', 'b', 'y']))
    .then(() => console.log('Item successfully removed from set!'))
    .then(() => client.getSetItems(sk1))
    .then(items => console.log(items))
    .then(() => client.isItemInSet(sk1, 'a'))
    .then(isIn => {
      console.log(`It should be false. acutual: ${isIn}`);
    })
    .then(() => client.isItemInSet(sk1, "yes"))
    .then(isIn => {
      console.log(`It should be true. acutual: ${isIn}`);
    })
    .catch(err => console.log(`Set Test error: ${err}`))
    .finally(() => {
      console.log(`Set test DONE!`);
      return client.delete(sk1);
    });
}

const testSortedSet = async (client: RedisClient) => {
  const ss1 = "testkeySortedTest1";
  const set1: ZsetCollection = {
    tom: 100,
    kate: 99,
    john: 120,
    josef: 23,
    bobin: 33,
    bond: 33,
  }

  console.log(`--------------- Start Sorted Set Test --------------------------`);
  await client.zAddToSet(ss1, set1)
    .then(() => client.zGetCount(ss1))
    .then(count => {
      console.log(`Count correct? ${count === Object.keys(set1).length}, expected: ${Object.keys(set1).length} | got: ${count}`)
    })
    .then(() => client.zGetCountWithScoreIn(ss1, 80, 100))
    .then(count => {
      console.log(`Count correct? ${count === 2}, expected: ${2} | got: ${count}`)
    })
    .then(() => {

    })
    .catch(err => console.log(`ERROR in Sorted Set Test: ${err}`))
    .finally(() => {
      console.log(`Sorted test DONE!`);
      return client.delete(ss1);
    })
}

const testExpire = async (client: RedisClient) => {

}



createCleint(options)
  .then((client) => {
    return testCounter(client)
      .then(() => testHash(client))
      .then(() => testList(client))
      .then(() => testSet(client))
      .then(() => testSortedSet(client))

      .finally(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            client.close();
            console.log('Client gracefully closed!');
            resolve(true);
          }, 1000);
        });
      });
  })
  .catch(err => {
    console.log(err);
    console.log("error happened");
  });

