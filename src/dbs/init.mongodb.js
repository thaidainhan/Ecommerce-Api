"use strict";
const { default: mongoose } = require("mongoose");
const { db } = require("../configs/mongodb.config");

const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;
const maxPoolSize = 50;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", {
        color: "true",
      });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: maxPoolSize,
      })
      .then((_) => {
        console.log(`MongoDB Connection Succeeded`);
      })
      .catch((err) => console.log("Error in DB connection: " + err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
