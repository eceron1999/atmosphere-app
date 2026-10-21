import { getLocationData } from "./api.js"
import { getWeatherInfo, formatLocation, getWindDirection } from "./utils.js"

export const elements = {
    // Header
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    currentLocBtn: document.getElementById('cur-loc-btn'),

    // Main Weather Hero
    currentLocation: document.getElementById('current-location'),
    timeStamp: document.getElementById('time-stamp'),
    celsiusBtn: document.getElementById('c-toggle-btn'),
    fahrenheitBtn: document.getElementById('f-toggle-btn'),
    currentTemp: document.getElementById('current-temp'),
    mobileIcon: document.getElementById('mobile-icon'),
    desktopIcon: document.getElementById('desktop-icon'),
    weatherCondition: document.getElementById('weather-condition'),
    apparentTemp: document.getElementById('apparent-temp'),
    highTemp: document.getElementById('high-temp'),
    lowTemp: document.getElementById('low-temp'),
    windSpeed: document.getElementById('wind-speed'),
    windDirection: document.getElementById('wind-direction'),
    humidityPercent: document.getElementById('humidity'),
    uvIndex: document.getElementById('uv-index'),
    uvIndexCondition: document.getElementById('uv-index-condition'),
    precipitationPercent: document.getElementById('precipitation'),

    // 7 Day Forecast
    weeklyForecastContainer: document.getElementById('forecast-container'),

    // AQI Section
    aqiNumber: document.getElementById('aqi-num'),
    aqiCondition: document.getElementById('aqi-condition'),
    mainPollutant: document.getElementById('main-pollutant'),
    aqiMessage: document.getElementById('aqi-message'),
    aqiScaleMarker: document.getElementById('aqi-scale-marker'),
    pm25: document.getElementById('pm2-5'),
    pm10: document.getElementById('pm10'),
    ozone: document.getElementById('ozone'),
    no2: document.getElementById('no2'),

    // Saved Locations
    savedLocationsNum: document.getElementById('saved-locations-num'),
    mobileSaveBtn: document.getElementById('mobile-save-btn'),
    savedLocationsContainer: document.getElementById('saved-locations'),
    desktopSaveBtn: document.getElementById('desktop-save-btn')
}

export function renderCurrentWeather(weatherData, locationData) {
    const weatherInfo = getWeatherInfo(weatherData.current.weather_code)

    elements.currentLocation.innerText = formatLocation(locationData)
    elements.currentTemp.innerText = `${Math.round(weatherData.current.temperature_2m)}`
    elements.mobileIcon.className = `fa-solid ${weatherInfo.icon} text-6xl text-amber-400 sm:text-7xl`
    elements.desktopIcon.className = `fa-solid ${weatherInfo.icon} text-5xl text-amber-400`
    elements.weatherCondition.innerText = weatherInfo.description
    elements.apparentTemp.innerText = `${Math.round(weatherData.current.apparent_temperature)}`
    elements.humidityPercent.innerText = weatherData.current.relative_humidity_2m
    elements.windSpeed.innerText = weatherData.current.wind_speed_10m
    elements.windDirection.innerText = getWindDirection(weatherData.current.wind_direction_10m)
}