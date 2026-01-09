import { FastifyError } from "fastify";
import { HttpError } from "./http-error";

export function isFastifyValidationError(
  error: unknown
): error is FastifyError & {
  validation: any[];
  validationContext?: "body" | "querystring" | "params" | "headers";
} {
  return typeof error === "object" && error !== null && "validation" in error;
}

function normalizePath(instancePath: string, context?: string): string {
  const path = instancePath.replace(/^\//, "").replace(/\//g, ".");

  return context ? (path ? `${context}.${path}` : context) : path || "unknown";
}

export function formatValidationErrors(
  error: FastifyError & {
    validation: any[];
    validationContext?: string;
  }
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.validation) {
    const field = normalizePath(issue.instancePath, error.validationContext);

    errors[field] = issue.message;
  }

  return errors;
}

export class ValidationError extends HttpError {
  readonly statusCode = 400;
  readonly type = "https://example.com/problems/validation-error";
  readonly title = "Validation Error";

  constructor(
    public readonly errors: Record<string, string>,
    message = "One or more fields are invalid."
  ) {
    super(message);
  }

  override toProblem() {
    return {
      ...super.toProblem(),
      errors: this.errors,
    };
  }
}
