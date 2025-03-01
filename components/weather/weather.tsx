import s from './Weather.module.scss'
import {FormEvent, useEffect, useState} from "react";
import {weatherAPI} from "@/api/weather/weather.api.ts";
import {ForecastDataList, WeatherData} from "@/api/weather/weather.types";
import weatherLogo from "@/assets/imgs/weatherLogo.png";
import {Humidity, SpeedWind, Sunrise, Sunset} from "@/assets/icons";
// import {Forecast} from "./Forecast";
// import {Preloader} from "@/components/Preloader";
import {useTranslation} from "react-i18next";
// import {LanguageSwitcher} from "@/components/LanguageSwitcher/LanguageSwitcher.tsx";

export const Weather = () => {
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [searchInput, setSearchInput] = useState<string>("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>("Москва");
    const [forecast, setForecast] = useState<ForecastDataList[]>([]);
    const [error, setError] = useState<string | null>(null);

    const {t, i18n} = useTranslation();

    const fetchWeatherData = async (cityName: string) => {
        try {
            setIsFetching(true)
            setError(null);

            const weatherData = await weatherAPI.getWeatherData(cityName, i18n.language)
            setWeatherData(weatherData);

            const forecastData = await weatherAPI.getForecastData(cityName, i18n.language)

            const dailyForecast = forecastData.list.filter(
                (_, index: number) => index % 8 === 0
            );

            setForecast(dailyForecast);
            setCity(cityName);
        } catch (err) {
            setError("Неверное название города");
        } finally {
            setIsFetching(false)
        }
    };

    useEffect(() => {
        fetchWeatherData(city);
    }, [city, i18n.language]);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchWeatherData(searchInput);
    };

    if (isFetching) return <Preloader/>;

    const dayOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    const sunOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    return (
        <>
            <div className={s.card}>
                <div className={s.cardLogo}>
                    <img src={weatherLogo} alt="weather-logo"/>
                </div>
                <div className={s.langs}>
                    <LanguageSwitcher/>
                </div>

                <div className={s.wrapper}>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            className={s.cardSearchBar}
                            placeholder={t("weatherPage.placeholder")}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                    {error && <p className="error">{error}</p>}

                    {weatherData && weatherData.main && weatherData.weather && (

                        <div className={s.cardWeather}>

                            <div className={s.cardTemperatureWrapper}>
                                <div className={s.cardTemperature}>
                                    {Math.round(weatherData.main.temp)}<span className={s.celsius}>°</span>
                                </div>
                            </div>

                            <div className={s.cityDateWrapper}>
                                <div className={s.cityDate}>
                                    <p className={s.city}>{weatherData.name}</p>
                                    <p>{new Date(weatherData.dt * 1000).toLocaleDateString(`${i18n.language}-${i18n.language.toUpperCase()}`, dayOptions)}</p>
                                </div>
                                <div className={s.iconDescription}>
                                    <img
                                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                                        alt="weather-icon"
                                    />
                                    <p>{weatherData.weather[0].description}</p>
                                </div>
                            </div>


                            <div className={s.cardWeatherDetails}>

                                <div className={s.detailsRow}>
                                    <div className={s.detailsDuo}>

                                        <div className={s.detailItem}>
                                            <Humidity/>
                                            <p>{Math.round(weatherData.main.humidity)}%</p>
                                        </div>

                                        <div className={s.detailItem}>
                                            <SpeedWind/>
                                            <p>{Math.round(weatherData.wind.speed)} {t("weatherPage.m/s")}</p>
                                        </div>

                                    </div>
                                    <div className={s.detailsDuo}>

                                        <div className={s.detailItem}>
                                            <Sunrise/>
                                            <p>{new Date(weatherData?.sys.sunrise * 1000).toLocaleTimeString(`${i18n.language}-${i18n.language.toUpperCase()}`, sunOptions)}</p>
                                        </div>

                                        <div className={s.detailItem}>
                                            <Sunset/>
                                            <p>{new Date(weatherData?.sys.sunset * 1000).toLocaleTimeString(`${i18n.language}-${i18n.language.toUpperCase()}`, sunOptions)}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {forecast.length > 0 && city && forecast && (

                <div className={s.forecastWrapper}>
                    <h2>{t("weatherPage.header")}</h2>
                    <div className={s.forecast}>
                        {forecast.map((day, index) => (

                            <Forecast key={index}
                                      day={new Date(day.dt * 1000).toLocaleDateString(`${i18n.language}-${i18n.language.toUpperCase()}`, {
                                          weekday: "short",
                                      })}
                                      temperature={Math.round(day.main.temp)}
                                      windSpeed={day.wind.speed} humidity={day.main.humidity}
                                      maxTemp={Math.round(day.main.temp_max)}
                                      minTemp={Math.round(day.main.temp_min)}
                                      condition={day.weather[0].description}
                                      icon={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}/>

                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
