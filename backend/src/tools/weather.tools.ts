import { tool } from "langchain";
import { z } from "@app/shared/src/index.js";
import logger from "../utils/logger.utils.js";

export const getCurrentWeather = tool(
  async ({ city }) => {
    logger.info({ message: "Get Current Weather tool called", city });

    try {
      const apiKey = process.env.WEATHER_API_KEY;
      if (!apiKey) {
        return "Error: WEATHER_API_KEY is not configured.";
      }

      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);

      if (!response.ok) {
        return "Error: Could not fetch weather data. The city might be invalid.";
      }

      const data = await response.json();

      return data.current;
    } catch (error) {
      logger.error({ message: "Current weather tool error", error });
      return "Network error: Unable to connect to weather service.";
    }
  },
  {
    name: "get_current_weather",
    description: "Fetch the current, real-time weather conditions for a specifically named city.",
    schema: z.object({
      city: z.string().describe("The name of the city to get the current weather for. Format: 'City, Country' or just 'City'. Provide the full name, no abbreviations."),
    }),
  },
);

export const getDailyWeatherForecast = tool(
  async ({ city, day }) => {
    logger.info({ message: "Get forecast Weather tool called", city, day });

    const dayNumber = Number(day);

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 3) {
      return "Invalid day value. Please provide a number between 1 and 3.";
    }

    try {
      const apiKey = process.env.WEATHER_API_KEY;
      if (!apiKey) {
        return "Error: WEATHER_API_KEY is not configured.";
      }

      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${dayNumber}`);

      if (!response.ok) {
        return "Something went wrong! Please try again later.";
      }

      const data = await response.json();
      const forecast = data.forecast?.forecastday?.[dayNumber - 1]?.day;

      if (!forecast) {
        return `No forecast data found for day ${day}.`;
      }


      return forecast;
    } catch (error) {
      logger.error({ message: "Weather forecast tool error", error });
      return "Network error: Unable to connect to weather service.";
    }
  },
  {
    name: "get_daily_weather_forecast",
    description: "Get a detailed daily weather forecast strictly 1 to 3 days ahead for a city. Do NOT use this tool for 'current' or 'now' weather requests.",
    schema: z.object({
      city: z.string().describe("The city name to get the weather forecast for. Format: 'City, Country' or just 'City'."),
      day: z.coerce.number().min(1).max(3).describe("The numerical day of the forecast (1 = today's forecast, 2 = tomorrow, 3 = day after tomorrow)."),
    }),
  },
);
