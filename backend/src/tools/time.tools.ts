import { tool } from "langchain";
import { z } from "@app/shared/src/index.js";

export const getCurrentTime = tool(
  async ({ timezone = "UTC" }) => {
    return new Date().toLocaleString("en-US", { timeZone: timezone });
  },
  {
    name: "get_current_time",
    description: "Get current time",
    schema: z.object({
      timezone: z.string().optional().default("UTC").describe("The timezone to get the current time for"),
    }),
  },
);
