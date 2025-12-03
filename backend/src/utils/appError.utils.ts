export class AppError extends Error {
  statusCode: number;
  details?: Record<string, any>;

  constructor(message: string, statusCode: number, details?: Record<string, any>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details?: Record<string, any>) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access", details?: Record<string, any>) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: Record<string, any>) {
    super(message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: Record<string, any>) {
    super(message, 404, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", details?: Record<string, any>) {
    super(message, 500, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too Many Requests, please try again later.", details?: Record<string, any>) {
    super(message, 429, details);
  }
}
