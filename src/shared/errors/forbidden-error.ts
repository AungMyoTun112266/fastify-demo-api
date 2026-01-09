import { HttpError } from "./http-error";

export class ForbiddenError extends HttpError {
  readonly statusCode = 403;
  readonly type = "https://example.com/problems/forbidden";
  readonly title = "Access denied";

  constructor(message = "You do not have permission to access this resource.") {
    super(message);
  }
}
