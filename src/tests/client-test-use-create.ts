import { IRedisClientOptions, ObjFieldValue, ObjInRedis, RedisClient, ZSetItem } from "../client";
import redisCommands from "../commands";
import protocol from "../protocol";

import { createClient } from "../";

const options: IRedisClientOptions = {
    host: 'localhost',
    port: 6379,
  };


const testGeneral = async (client:RedisClient) => {
  const k1 = "tesetkey1";
  const k2 = "tesetkey2";
  const k3 = "tesetkey3";
  const k4 = "tesetkey4";

  console.log(`--------------- Start General Test --------------------------`);
  await client.set(k1, "yes")
    .then(() => client.get(k1))
    .then(val => console.log(`The value returned should be "yes"? ${"yes" === val}`))
    .then(() => client.mset([k1, k2, k3, k4], ["v1", "v2", "v3", "v4"]))
    .then(() => client.mget(k1, k2, k3, k4))
    .then(vals => {
      console.log(`It should be ${"v1v2v3v4"}? ${"v1v2v3v4" === vals.join("")}`);
    })
    .then(() => client.mset(k1, "val1", k2, "val2", k4, "val4"))
    .then(() => client.mget(k1, k2, k4))
    .then(vals => {
      console.log(vals);
    })
    .catch(err => console.log(`ERROR on General TEST: ${err}`))
    .finally(() => {
      console.log(`General test DONE!`);
      return client.delete(k1, k2, k3, k4);
    });
}

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
    nullField: null,
  };
  const date2 = new Date((testObj.birthDate as Date).getTime() + 10000);
  const ktest = "testhashobj";

  console.log(`--------------- Start Hash Test --------------------------`);
  await client.setObject(ktest, testObj)
    .then(() => {
      console.log(`Object successfully set!`);
    })
    .then(() => { 
      return client.getObject(ktest) })
    .then(obj => {
      // console.log(obj);
      console.log(`Field Check: name (${testObj.name === obj.name})> original: ${testObj.name} | returned: ${obj.name}`);
      console.log(`Field Check: userID (${testObj.userID === obj.userID})> original: ${testObj.userID} | returned: ${obj.userID}`);
      console.log(`Field Check: age (${testObj.age === obj.age})> original: ${testObj.age} | returned: ${obj.age}`);
      console.log(`Field Check: birthDate (${(testObj.birthDate as Date).getTime() === (obj.birthDate as Date).getTime()})> original: ${(testObj.birthDate as Date).toISOString()} | returned: ${(obj.birthDate as Date).toISOString()}`);
      console.log(`Field Check: motto (${testObj.motto === obj.motto})> original: ${testObj.motto} | returned: ${obj.motto}`);
      console.log(`Field Check: occupation (${testObj.motto === obj.motto})> original: ${testObj.occupation} | returned: ${obj.occupation}`);
      console.log(`Field Check: nullField (${testObj.nullField === obj.nullField})> original: ${testObj.nullField} | returned: ${obj.nullField}`);
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
  const set1: ZSetItem[] = [
    {name: "tom", score: 100},
    {name: "kate", score: 99},
    {name: "john", score: 120},
    {name: "josef", score: 23},
    {name: "bobin", score: 33},
    {name: "bond", score: 33},
  ];

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
    .then(() => client.zIncrBy(ss1, "bobin", 95))
    .then(newScore => console.log(`Bobbin's new score should be ${33 + 95}, right ? ${newScore === 33 + 95}`))
    .then(() => client.zGetTopItems(ss1, 3))
    .then(items => {
      console.log(items);
    })
    .then(() => client.zGetBottomItems(ss1, 2))
    .then(items => console.log(items))
    .then(() => client.zGetRank(ss1, "john"))
    .then(rank => console.log(`John's rank should be ${5} ? ${4 === rank}`))
    .then(() => client.zGetItemsWithScoresIn(ss1, 100, 120))
    .then(items => {
      console.log(`It should be only "tom" and "john" ? ${items.map(x => `"${x.name}"`).join(" ")}`);
      console.log(items);
    })
    .then(() => client.zGetScoresOfMembers(ss1, ["josef", "bond", "husky"]))
    .then(scores => {
      console.log(`Score check 1: josef should be ${23} ? ${23 === scores[0]}`);
      console.log(`Score check 2: bond should be ${33} ? ${33 === scores[1]}`);
      console.log(`Score check 3: Husky should be ${null} ? ${null === scores[2]}`);
    })
    .then(() => client.zRemoveMembers(ss1, ["kate", "bobin", "husky"]))
    .then(() => client.zGetScoresOfMembers(ss1, ["bobin", "kate"])) 
    .then(scores => {
      console.log(`Kate should be ${null}? ${null === scores[0]}`);
      console.log(`Bobin should be ${null}? ${null === scores[1]}`);
    })
    .catch(err => console.log(`ERROR in Sorted Set Test: ${err}`))
    .finally(() => {
      console.log(`Sorted test DONE!`);
      return client.delete(ss1);
    })
}

const testExpire = async (client: RedisClient) => {
  const ek1 = "expireTestKey1";

  console.log(`--------------- Start EXPIRE Test --------------------------`);
  await client.set(ek1, "test expire")
    .then(() => client.get(ek1))
    .then(val => console.log(`It should be "test expire" ? ${"test expire" === val}`))
    .then(() => client.expireAfter(ek1, 5))
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 6000);
      })
    })
    .then(() => client.get(ek1))
    .then(val => console.log(`It should be null ? ${null === val}`))
    .then(() => client.set(ek1, "expire at"))
    .then(() => client.get(ek1))
    .then(val => console.log(`It should be "expire at" ? ${"expire at" === val}`))
    .then(() => {
      const timeToExpire = new Date(new Date().getTime() + 1000);
      return client.expireAt(ek1, timeToExpire, true);
    })
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 1100);
    }))
    .then(() => client.get(ek1))
    .then(val => console.log(`It should be null ? ${null === val}`))
    .catch(err => console.log(`Error happened when EXPIRE TEST: ${err}`))
    .finally(() => {
      console.log("Expire Test Done!");
      return client.delete(ek1);
    });
}


createClient(options, true)
  .then((client) => {
    return testGeneral(client)
      .then(() => testCounter(client))
      .then(() => testHash(client))
      .then(() => testList(client))
      .then(() => testSet(client))
      .then(() => testSortedSet(client))
      .then(() => testExpire(client))

      .finally(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            client.close();
            console.log(`--------------- Client Test DONE!!! --------------------------`);
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

