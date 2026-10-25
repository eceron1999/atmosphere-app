import { getLocationData } from "./api.js"
import { getWeatherInfo, formatLocation, getWindDirection, getFormattedCurrentTime, getUvDetails } from "./utils.js"

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
    const uvMax = weatherData.daily.uv_index_max[0]
    const uvDetails = getUvDetails(uvMax)

    elements.currentLocation.innerHTML = formatLocation(locationData)
    elements.currentTemp.innerText = `${Math.round(weatherData.current.temperature_2m)}`
    elements.mobileIcon.className = `fa-solid ${weatherInfo.icon} text-6xl ${weatherInfo.color} sm:text-7xl`
    elements.desktopIcon.className = `fa-solid ${weatherInfo.icon} text-5xl ${weatherInfo.color}`
    elements.weatherCondition.innerText = weatherInfo.description
    elements.apparentTemp.innerText = `${Math.round(weatherData.current.apparent_temperature)}`
    elements.highTemp.innerText = `${Math.round(weatherData.daily.temperature_2m_max[0])}`
    elements.lowTemp.innerText = `${Math.round(weatherData.daily.temperature_2m_min[0])}`
    elements.humidityPercent.innerText = weatherData.current.relative_humidity_2m
    elements.windSpeed.innerText = weatherData.current.wind_speed_10m
    elements.windDirection.innerText = getWindDirection(weatherData.current.wind_direction_10m)
    elements.uvIndex.innerText = uvMax
    elements.uvIndexCondition.innerText = uvDetails.text
    elements.uvIndexCondition.className = uvDetails.className
    elements.precipitationPercent.innerText = weatherData.daily.precipitation_probability_max[0]
}

export function updateTime() {
    elements.timeStamp.innerText = getFormattedCurrentTime()
}

function setButtonState(button, isActive) {
    button.setAttribute('aria-pressed', isActive)
    button.classList.toggle('text-text-main', isActive)
    button.classList.toggle('font-semibold', isActive)
    button.classList.toggle('bg-brand-surface', isActive)
    button.classList.toggle('hover:shadow-sm', isActive)
    button.classList.toggle('text-text-muted', !isActive)
    button.classList.toggle('bg-transparent', !isActive)
    button.classList.toggle('hover:text-text-main', !isActive)
    button.classList.toggle('hover:bg-brand-surface/50', !isActive)
}

export function updateUnitToggleUI(currentUnit) {
    const isCelsius = currentUnit === 'celsius'
    
    setButtonState(elements.celsiusBtn, isCelsius)
    setButtonState(elements.fahrenheitBtn, !isCelsius)
}