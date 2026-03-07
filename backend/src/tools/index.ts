import { InternetSearch } from "./internetSearch.tools.js";
// import { getCurrentTime } from "./time.tools.js";
import { getDailyWeatherForecast, getCurrentWeather } from "./weather.tools.js";
import { searchUploadedDocuments } from "./ragSearch.tools.js";

export default [InternetSearch, getCurrentWeather, getDailyWeatherForecast, searchUploadedDocuments];
