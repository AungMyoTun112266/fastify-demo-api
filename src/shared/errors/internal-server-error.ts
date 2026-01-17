import { HttpError } from "./http-error";

export class InternalServerError extends HttpError {
  readonly statusCode = 500;
  readonly type = "https://example.com/problems/internal-server-error";
  readonly title = "Internal Server Error";

  constructor(
    message = "We’re unable to process your request at the moment. Please try again later."
  ) {
    super(message);
  }
}
