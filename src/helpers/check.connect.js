"use strict";
const mongoose = require("mongoose");

const _SECONDS = 99999;
const os = require("os");
const process = require("process");

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connections based on number cores
    const maxConnections = numCores * 5;

    console.log(`Active connections:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, [_SECONDS]); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
