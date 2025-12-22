import { Context, Next } from "hono";
import { z, ZodError } from "zod";
import { BadRequestError, InternalServerError } from "../utils/appError.utils.js";

export function validate(schema: z.ZodObject<any, any>) {
  return async (c: Context, next: Next) => {
    try {
      const data = schema.parse(await c.req.json());
      c.set("body", data);
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const isDefaultError = error.issues[0].message.startsWith("Invalid input");
        const message = isDefaultError ? `${error.issues[0].path}: ${error.issues[0].message}` : error.issues[0].message;
        throw new BadRequestError(message);
      }

      throw new InternalServerError("Something went wrong. Please try again later.");
    }
  };
}

export function validateParams(schema: z.ZodTypeAny) {
  return async (c: Context, next: Next) => {
    try {
      const data = schema.parse(c.req.param());
      c.set("param", data);
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const isDefaultError = error.issues[0].message.startsWith("Invalid input");
        const message = isDefaultError ? `${error.issues[0].path}: ${error.issues[0].message}` : error.issues[0].message;

        throw new BadRequestError(message);
      }

      throw new InternalServerError("Something went wrong. Please try again later.");
    }
  };
}
