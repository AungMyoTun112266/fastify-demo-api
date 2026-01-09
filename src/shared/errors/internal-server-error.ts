import { HttpError } from "./http-error";

export class InternalServerError extends HttpError {
  readonly statusCode = 500;
  readonly type = "https://example.com/problems/internal-server-error";
  readonly title = "Internal Server Error";

  constructor(message = "Something went wrong") {
    super(message);
  }
}
