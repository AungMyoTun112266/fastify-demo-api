import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  readonly statusCode = 404;
  readonly type = "https://example.com/problems/not-found";
  readonly title = "Not Found";

  constructor(message = "The requested resource was not found.") {
    super(message);
  }
}
