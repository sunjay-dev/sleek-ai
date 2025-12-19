import type { Context } from "hono";
import { AppError } from "../utils/appError.utils.js";
import logger from "../utils/logger.utils.js";

export function errorHandler(err: Error, c: Context) {
  if (err instanceof AppError) {
    logger.error(
      {
        statusCode: err.statusCode,
        details: err.details ?? {},
        method: c.req.method,
        url: c.req.path,
      },
      err.message,
    );

    return c.json(
      {
        message: err.message,
        ...(err.details ?? {}),
      },
      err.statusCode,
    );
  }

  logger.error({ stack: err.stack || {}, method: c.req.method, url: c.req.path }, err.message);

  return c.json({ message: "Something went wrong, Please try again later." }, 500);
}
