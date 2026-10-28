import { getAirQuality, getLocationData } from "./api.js"
import { getWeatherInfo, formatLocation, getWindDirection, getFormattedCurrentTime, getUvDetails, formatDayName, getTempPercent, getAqiStatus, getMainPollutant } from "./utils.js"

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
    aqiMessageBg: document.getElementById('aqi-message-bg'),
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

export function renderAQI(airQualityData) {
    const aqiInfo = airQualityData.current
    const aqiStatus = getAqiStatus(aqiInfo.us_aqi)
    const mainPollutant = getMainPollutant(airQualityData)

    elements.aqiNumber.innerText = aqiInfo.us_aqi
    elements.aqiCondition.innerText = aqiStatus.status
    elements.aqiCondition.className = `inline-flex items-center px-3 py-1 font-semibold text-xs ${aqiStatus.badgeColor} border rounded-full sm:text-sm`
    elements.mainPollutant.innerText = mainPollutant.name
    elements.aqiMessage.innerText = aqiStatus.description
    elements.aqiMessageBg.className = `p-2.5 ${aqiStatus.messageColor} border rounded-lg lg:p-1`
    elements.pm25.innerText = aqiInfo.pm2_5
    elements.pm10.innerText = aqiInfo.pm10
    elements.ozone.innerText = aqiInfo.ozone
    elements.no2.innerText = aqiInfo.nitrogen_dioxide
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

export function renderWeeklyForecast(weatherData) {
    const currentTemp = Math.round(weatherData.current.temperature_2m)
    const weekMin = Math.min(...weatherData.daily.temperature_2m_min)
    const weekMax = Math.max(...weatherData.daily.temperature_2m_max)

    const forecastHTML = weatherData.daily.time.map((date, index) => {
        const weatherCode = weatherData.daily.weather_code[index]
        const weatherInfo = getWeatherInfo(weatherCode)

        const dayLabel = index === 0 ? 'Today' : formatDayName(date)

        const dailyPrecipitation = weatherData.daily.precipitation_probability_max[index]

        const minTemp = Math.round(weatherData.daily.temperature_2m_min[index])
        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[index])

        const percent = getTempPercent(currentTemp, weekMin, weekMax)
        const leftPercent = ((minTemp - weekMin) / (weekMax - weekMin)) * 100
        const rightPercent = ((weekMax - maxTemp) / (weekMax - weekMin)) * 100
        const currentTempDot = index === 0 ? `<div style="left: ${percent}%" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-text-main rounded-full ring-2 ring-brand-surface"></div>` : ''

        return `
        <li aria-label="${dayLabel}'s forecast: ${weatherInfo.description}, high of ${maxTemp}, low of ${minTemp}, ${dailyPrecipitation}% chance of rain" class="grid grid-cols-[4rem_1fr_9rem] items-center gap-2 p-3 bg-brand-bg/50 border border-hairline/50 rounded-lg sm:grid-cols-[4rem_1fr_1fr_auto] hover:bg-brand-bg/80">
                    <div aria-hidden="true" class="contents">
                        <!-- Day -->
                        <time datetime="${date}" class="font-bold text-text-main">${dayLabel}</time>
    
                        <!-- Condition -->
                        <p class="flex items-center justify-self-center gap-2 min-w-0">
                            <i aria-hidden="true" class="fa-solid ${weatherInfo.icon} ${weatherInfo.color}"></i>
                            <span class="hidden font-medium text-sm text-text-main truncate sm:inline-block">${weatherInfo.description}</span>
                        </p>
    
                        <!-- Precipitation % -->
                        <p class="hidden sm:flex items-center justify-center gap-1 w-24 text-xs text-text-muted tabular-nums">
                            <i aria-hidden="true" class="fa-solid fa-droplet text-accent-sky"></i>
                            <span class="inline-block text-right w-8 text-sm">${dailyPrecipitation}%</span>
                        </p>
    
                        <!-- High/Low Temp Range -->
                         <div class="flex items-center gap-2 justify-self-end">
                            <span class="font-medium text-sm text-text-muted">${minTemp}&deg;</span>
    
                            <!-- Outer Track Range -->
                            <div aria-hidden="true" class="relative w-20 h-2 bg-white/10 border border-white/20 rounded-full sm:w-28 lg:w-36">
                                <!-- Todays Range -->
                                <div style="left: ${leftPercent}%; right: ${rightPercent}%" class="absolute inset-y-0 right-[32%] bg-linear-to-r from-teal-400 via-emerald-400 to-yellow-400 rounded-full"></div>
                                <!-- Current Temp Dot -->
                                ${currentTempDot}
                            </div>
                            <span class="font-semibold text-sm text-text-main">${maxTemp}&deg;</span>
                         </div>
                    </div>
                </li>`
    }).join('')

    elements.weeklyForecastContainer.innerHTML = forecastHTML
}