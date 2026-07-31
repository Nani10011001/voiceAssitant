import { type Response } from "express";

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
abstract class ApiResponse {
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

     private static sanitize<T extends ApiResponse>(response: T): T {
       return response;
    }
}
