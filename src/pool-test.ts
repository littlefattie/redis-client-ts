import { RedisClientPool } from ".";

const pool = new RedisClientPool( {
  host: "127.0.0.1",
  port: 6379,
  connMin: 4,
  connMax: 15,
}, true);

const pollInfoHanlder = setInterval(() => {
  console.clear();
  console.log(`
  POOL INFO:                    at ${new Date().toLocaleTimeString()}
  ---------------------------------------------
  connections:      ${pool.connActual}
  working:          ${pool.workingClients.length}
  idle:             ${pool.idleClients.length}
  ----------------------------------------------
  `)
}, 10000);

const rootPromise = new Promise((res, rej) => {
  setTimeout(() => {
    res(true);
  }, 3000);
});

let putClientIntervalId: NodeJS.Timer;

const clientIds: string[] = [];

rootPromise
  .then(() => pool.getClient())
  .then(c => {
    console.log(` 1 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 2 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 3 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 4 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 5 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 6 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 7 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 8 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(` 9 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`10 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`11 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`12 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`13 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`14 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`15 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })
  .then(c => {
    console.log(`16 - Client ID: ${c.id}`);
    clientIds.push(c.id);
    return pool.getClient();
  })  
  .catch(err => {
    console.log(`Promise Rejected: ${err}`);
    console.log(`Failed when get clients! already got: ${clientIds.length}`);
    return Promise.resolve()
      .then(() => {
        putClientIntervalId = setInterval(() => {
          if (clientIds.length > 0) {
            pool.putClient(clientIds.pop() as string)
          } else {
            clearInterval(putClientIntervalId);
          }
        }, 12000)
      })
  });


