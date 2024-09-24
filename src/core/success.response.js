'use strict'

const StatusCodes = {
  OK : 200,
  CREATED : 201,
  BAD_REQUEST : 400,
  UNAUTHORIZED : 401,
  FORBIDDEN : 403,
  NOT_FOUND : 404,
  REQUEST_TIMEOUT : 408,
  CONFLICT : 409,
  TOO_MANY_REQUESTS : 429,
  INTERNAL_SERVER_ERROR : 500
}

const ReasonPhrases = {
  OK : "OK",
  CREATED : "Created",
  BAD_REQUEST : "Bad Request",
  UNAUTHORIZED : "Unauthorized",
  FORBIDDEN : "Forbidden",
  NOT_FOUND : "Not Found",
  REQUEST_TIMEOUT : "Request Timeout",
  CONFLICT : "Conflict",
  TOO_MANY_REQUESTS : "Too Many Requests",
  INTERNAL_SERVER_ERROR : "Internal Server Error"
}


class SuccessResponse {

  constructor({ message, status = StatusCodes.OK, reason = ReasonPhrases.OK , metadata = {} }){
    this.message = !message ? reason : message;
    this.status = status;
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status( this.status ).json( this );
  }
}

class OkSuccess extends SuccessResponse{

  constructor({ message, metadata }){
    super({ message, metadata });
  }
}

class CreatedSuccess extends SuccessResponse{

  constructor({ options = {} , message, status = StatusCodes.CREATED, reason = ReasonPhrases.CREATED, metadata = {} }){
    super({ message, status, reason, metadata });
    this.options = options
  }
}

module.exports = {
  OkSuccess,
  CreatedSuccess,
  SuccessResponse
}