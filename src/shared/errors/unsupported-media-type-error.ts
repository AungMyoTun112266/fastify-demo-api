import { HttpError } from "./http-error";

export class UnsupportedMediaTypeError extends HttpError {
  readonly statusCode = 415;
  readonly type = "https://example.com/problems/unsupported-media-type";
  readonly title = "Unsupported Media Type";

  constructor(message = "Unsupported content type.") {
    super(message);
  }
}
