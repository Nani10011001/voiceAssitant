import { type Response } from "express";
import { STATUS_CODES } from "node:http";

// api reponse for it
enum StatusCode {
    SUCCESS = "10000",
    FAILURE = "10001",
    RETRY = "10002",
    INVALID_ACCESS_TOKEN = "10003"
}

enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}

export abstract class ApiResponse {
    constructor(
  protected statusCode: StatusCode,
  protected status: ResponseStatus,
  protected message: string

    ) {
        
    }
    protected prepare <T extends ApiResponse>(
        res:Response,
        response: T,
        headers: {
            [key:string]: string
        }

    ): Response { 
for (const [key, value] of Object.entries(headers)) 
    res.append(key, value);

return res.status(this.status).json(ApiResponse.sanitize(response));
    }
    public send(
        res:Response,
        headers: {[key: string]: string} = {},
    ): Response {
    return this.prepare<ApiResponse>(res,this, headers)
    }

     private static sanitize<T extends ApiResponse>(response: T): T {
       return response;
    }
}

export class AuthFailureResponse extends ApiResponse {
    constructor(message: string = "Authentication Failure") {
        super( StatusCode.FAILURE, ResponseStatus.UNAUTORIZED,message
        )
    }
}

export class NotFoundResponse extends ApiResponse {
    constructor( message: string = "Not Found") {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message)
    }
    public send(res: Response, headers: { [key: string]: string; }= {}): Response {
        return super.prepare<NotFoundResponse>(res,this, headers)
    }
}

export class SuccessMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message)
    }
}

export class ForbiddenResponse extends ApiResponse {

    constructor(message = "Forbidden") {
        super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message)
    }
 
}

export class BadRequestResponse extends ApiResponse {
    constructor( message = "Bad Parameters") {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message)
    }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
  }
}
