"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

// Create a new server
const redisClient = redis.createClient();

redisClient.on("connect", () => {
  console.log("Connected to Redis!");
});

redisClient.on("error", (err) => {
  console.log(err.message);
});

redisClient.on("ready", () => {
  console.log("Redis is ready");
});

redisClient.on("end", () => {
  console.log("Redis connection ended");
});

process.on("SIGINT", () => {
  redisClient.quit();
});

// redisClient.ping((err, results) => {
//   if (err) {
//     console.error(`Error connecting to Redis::`, err);
//   } else {
//     console.log("Connected to Redis::");
//   }
// });

const pexpire = promisify(redisClient.pExpire).bind(redisClient);

const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const exprieTime = 3000; // 3s tam lock

  for (let i = 0; i < retryTimes.length; i++) {
    // Tao 1 key thang nao nam giu dc vao thanh toan
    const results = await setnxAsync(key, exprieTime);
    if (results === 1) {
      // thao tac voi inventory
      const isReversion = await reservationInventory({
        productId,
        cartId,
        quantity,
      });
      if (isReversion.modifiedCount > 0) {
        await pexpire(key, exprieTime);
      } else {
        return null;
      }
      return key;
    } else {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 100);
      });
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
