import { HttpError } from "./http-error";

export class UnauthorizedError extends HttpError {
  readonly statusCode = 401;
  readonly type = "https://example.com/problems/unauthorized";
  readonly title = "Unauthorized";

  constructor(message = "Authentication is required to access this resource.") {
    super(message);
  }
}
