"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const myLogger = require("../loggers/mylogger.log");

class SuccessReponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;

 
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessReponse {
  constructor({ message, metadata = {} }) {
    super({ message, metadata });
  }
}
class Created extends SuccessReponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
class Updateed extends SuccessReponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  OK,
  Created,
  SuccessReponse,
};
