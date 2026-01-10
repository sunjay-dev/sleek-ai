import type { Context } from "hono";
import { AppError } from "../utils/appError.utils.js";
import logger from "../utils/logger.utils.js";
import { HTTPException } from "hono/http-exception";

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

  if (err instanceof HTTPException) {
    logger.error(
      {
        stack: process.env.NODE_ENV === "production" ? null : err.stack || {},
        statusCode: err.status,
        message: err.message,
        method: c.req.method,
        url: c.req.path,
      },
      err.message,
    );

    return c.json({ message: err.message }, err.status);
  }

  logger.error(
    {
      stack: process.env.NODE_ENV === "production" ? null : err.stack || {},
      method: c.req.method,
      url: c.req.path,
    },
    err.message,
  );

  return c.json({ message: "Something went wrong, Please try again later." }, 500);
}
