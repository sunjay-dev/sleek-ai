import pino from "pino";
import { loggerEnv } from "./config/env.config.js";

const logger = pino({
  level: loggerEnv.LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(!loggerEnv.isProduction && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  }),
});

export default logger;
