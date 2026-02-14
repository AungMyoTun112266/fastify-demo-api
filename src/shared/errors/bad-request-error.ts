import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  readonly statusCode = 400;
  readonly type = "https://example.com/problems/bad-request";
  readonly title = "Bad request";

  constructor(message = "The request is invalid.") {
    super(message);
  }
}
