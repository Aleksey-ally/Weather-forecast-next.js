import axios from "axios";
import {ForecastData, WeatherData} from "./weather.types";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
})

export const weatherAPI = {
    async getWeatherData(city: string, lang: string) {
        const res = await instance.get<WeatherData>(`weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=${lang}`)
        return res.data
    },

    async getForecastData(city: string, lang: string) {
        const res = await instance.get<ForecastData>(`forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=${lang}`)
        return res.data
    }
}

