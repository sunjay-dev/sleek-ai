import { tool } from "langchain";
import * as z from "zod";

export const getCurrentWeather = tool(
  async ({ city }) => {
    const response = await fetch(`https://weather-website-rho-five.vercel.app/weather/?city=${city}`);

    if (!response.ok) {
      return "Something went wrong!, Please try again later";
    }

    const data = await response.json();

    return data.current;
  },
  {
    name: "get_current_weather",
    description: "Get current weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the cuurent weather for"),
    }),
  },
);

export const getDailyWeatherForecast = tool(
  async ({ city, day }) => {
    const dayNumber = Number(day);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 3) {
      return "Invalid day value. Please provide a number between 1 and 3.";
    }

    const response = await fetch(`https://weather-website-rho-five.vercel.app/weather/?city=${city}`);

    if (!response.ok) {
      return "Something went wrong! Please try again later.";
    }

    const data = await response.json();
    const forecast = data.forecast?.forecastday?.[day - 1].day;

    if (!forecast) {
      return `No forecast data found for day ${day}.`;
    }

    return forecast;
  },
  {
    name: "get_daily_weather_forecast",
    description: "Get a detailed daily weather forecast (1 to 3 days ahead) for a city.",
    schema: z.object({
      city: z.string().describe("The city name to get the weather forecast for."),
      day: z.number().min(1).max(3).describe("The day of the forecast (in number) (1 = today, 2 = tomorrow, 3 = day after tomorrow)."),
    }),
  },
);
