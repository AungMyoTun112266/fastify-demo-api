import { HttpError } from "./http-error";

export class ConflictError extends HttpError {
  readonly statusCode = 409;
  readonly type = "https://example.com/problems/conflict";
  readonly title = "Conflict";
  constructor(
    message = "The request could not be completed due to a conflict with the current state."
  ) {
    super(message);
  }
}
