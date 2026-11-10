import { getAirQuality, getLocationData } from "./api.js"
import { getWeatherInfo, formatLocation, getWindDirection, getFormattedCurrentTime, getUvDetails, formatDayName, getTempPercent, getAqiStatus, getMainPollutant, getAqiPercent } from "./utils.js"
import { getSavedLocations } from "./storage.js"

export const elements = {
    // Header
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    searchBtnIcon: document.getElementById('search-btn-icon'),
    currentLocBtn: document.getElementById('cur-loc-btn'),
    currentLocIcon: document.getElementById('cur-loc-icon'),

    // Main Weather Hero
    errorBanner: document.getElementById('error-banner'),
    currentLocation: document.getElementById('current-location'),
    saveLocationBtn: document.getElementById('save-location-btn'),
    saveLocationIcon: document.getElementById('save-location-icon'),
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
    savedLocationsContainer: document.getElementById('saved-locations'),
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
    elements.windSpeed.innerText = `${Math.round(weatherData.current.wind_speed_10m)}`
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
    const aqiMarkerPercent = getAqiPercent(aqiInfo.us_aqi)

    elements.aqiNumber.innerText = Math.round(aqiInfo.us_aqi)
    elements.aqiCondition.innerText = aqiStatus.status
    elements.aqiCondition.className = `inline-flex items-center px-3 py-1 font-semibold text-xs ${aqiStatus.badgeColor} border rounded-full sm:text-sm`
    elements.mainPollutant.innerText = mainPollutant.name
    elements.aqiMessage.innerText = aqiStatus.description
    elements.aqiMessageBg.className = `p-2.5 ${aqiStatus.messageColor} border rounded-lg lg:p-1`
    elements.aqiScaleMarker.style.left = `${aqiMarkerPercent}%`
    elements.pm25.innerText = Math.round(aqiInfo.pm2_5)
    elements.pm10.innerText = Math.round(aqiInfo.pm10)
    elements.ozone.innerText = Math.round(aqiInfo.ozone)
    elements.no2.innerText = Math.round(aqiInfo.nitrogen_dioxide)
}

export function showError(message) {
    if (!elements.errorBanner) return
    
    elements.errorBanner.textContent = message
    elements.errorBanner.classList.remove('hidden')
}

export function hideError() {
    if (!elements.errorBanner) return
    elements.errorBanner.textContent = ''
    elements.errorBanner.classList.add('hidden')
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

export function updateBookmarkUI(locationData) {
    const savedLocations = getSavedLocations()
    const isAlreadySaved = savedLocations.some(loc => loc.name === locationData.name && loc.admin1 === locationData.admin1)

    if (isAlreadySaved) {
        elements.saveLocationIcon.classList.remove('fa-regular')
        elements.saveLocationIcon.classList.remove('text-text-muted')
        elements.saveLocationIcon.classList.add('fa-solid')
        elements.saveLocationIcon.classList.add('text-accent-sky')
    } else {
        elements.saveLocationIcon.classList.remove('fa-solid')
        elements.saveLocationIcon.classList.remove('text-accent-sky')
        elements.saveLocationIcon.classList.add('fa-regular')
        elements.saveLocationIcon.classList.add('text-text-muted')
    }
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
        <li aria-label="${dayLabel}'s forecast: ${weatherInfo.description}, high of ${maxTemp}, low of ${minTemp}, ${dailyPrecipitation}% chance of rain" class="grid grid-cols-[4rem_1fr_9rem] items-center gap-2 p-3 bg-brand-bg/50 border border-hairline/50 rounded-lg sm:grid-cols-[4rem_1fr_1fr_auto] hover:bg-brand-bg/80 active:bg-brand-bg/90 active:scale-[0.99] transition-all duration-150">
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

export function renderSavedLocations(savedLocations, currentLocationData) {
    const badge = elements.savedLocationsNum
    if (badge) badge.textContent = savedLocations.length
     
    elements.savedLocationsContainer.innerText = ''

    if (savedLocations.length === 0) {
        elements.savedLocationsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-2 w-full p-8 text-center bg-brand-bg/40 border border-hairline/60 rounded-xl">
            <h3 class="font-bold text-text-main">
                No saved locations yet
            </h3>
            <p class="text-xs text-text-muted">
                Search for a city above and tap the bookmark icon to save it for quick access.
            </p>
        </div>
        `
        return
    } 

    elements.savedLocationsContainer.innerHTML = savedLocations.map(loc => {
        const { name, admin1, country_code, weatherData, latitude, longitude} = loc

        const isActive = currentLocationData && currentLocationData.name === name && currentLocationData.admin1 === admin1

        const currentTemp = Math.round(weatherData?.current.temperature_2m)
        const highTemp = Math.round(weatherData.daily.temperature_2m_max[0])
        const lowTemp = Math.round(weatherData.daily.temperature_2m_min[0])
        const precipitation = weatherData.daily.precipitation_probability_max[0]

        const weatherInfo = getWeatherInfo(weatherData.current.weather_code)
        
        return `
        <li data-lat="${latitude}" data-long="${longitude}" class="grid grid-cols-[100px_1fr_auto] items-center gap-2 w-full min-w-0 px-3 py-4 bg-brand-bg/40 rounded-xl min-[400px]:grid-cols-[105px_auto_auto_auto] min-[400px]:gap-2.5 min-[400px]:px-4 sm:grid-cols-[150px_auto_auto_auto] sm:gap-4 sm:px-6 min-[900px]:grid-cols-[65px_1fr_auto]! min-[900px]:self-start min-[900px]:gap-3! min-[900px]:px-2! min-[900px]:py-3! min-[1024px]:grid-cols-[80px_1fr_auto]! min-[1024px]:px-3! min-[1200px]:grid-cols-[90px_1fr_auto_auto]! transition-all duration-200 group cursor-pointer overflow-hidden active:scale-[0.98] active:bg-brand-bg/95 ${isActive ? 'border border-accent-sky bg-brand-bg/90 shadow-sm shadow-accent-sky/15 ring-1 ring-accent-sky/30' : 'border border-hairline/60 hover:bg-brand-bg/80 hover:border-accent-sky/50 hover:shadow-lg hover:shadow-accent-sky/5'}">
            <div class="flex flex-col justify-center min-w-0 overflow-hidden">
                <!-- City -->
                <p class="text-sm font-bold tracking-tight text-text-main sm:text-base min-[900px]:text-sm group-hover:text-accent-sky transition-colors truncate ${isActive ? 'text-accent-sky' : 'group-hover:text-accent-sky'}">${loc.name}</p>
                <!-- State/Country -->
                <p class="text-xs text-text-muted/80 truncate">${loc.admin1}, ${loc.country_code}</p>
            </div>
    
            <div class="flex flex-col items-center justify-center gap-0.5 min-w-0 px-1">
                <div class="flex items-center gap-1.5 min-w-0">
                    <!-- Weather Icon -->
                    <i aria-hidden="true" class="fa-solid ${weatherInfo.icon} shrink-0 w-6 text-center text-lg ${weatherInfo.color} min-[400px]:text-xl min-[900px]:text-lg group-hover:scale-110 transition-transform duration-200"></i>
                    <!-- Current Temp -->
                    <p class="text-base font-bold tracking-tight tabular-nums text-text-main sm:text-lg min-[900px]:text-sm!">${currentTemp}&deg;</p>
                </div>
    
                <!-- High/Low -->
                <p class="whitespace-nowrap text-[10px] text-text-muted min-[400px]:text-xs">H: ${highTemp}&deg; L: ${lowTemp}&deg;</p>
            </div>
    
            <!-- Precipitation % -->
            <div class="hidden min-[400px]:inline-flex items-center justify-center justify-self-center shrink-0 gap-1 px-1 py-0.5 text-xs font-semibold text-accent-sky bg-accent-sky/10 border border-accent-sky/30 rounded-full tabular-nums min-[900px]:hidden min-[1200px]:inline-flex">
                <i class="fa-solid fa-droplet"></i>
                <span>${precipitation}%</span>
            </div>
            <!-- Remove Button -->
            <button type="button" aria-label="Remove Raleigh from saved locations" class="flex items-center justify-center justify-self-center w-8 h-8 text-text-muted/70 rounded-full active:text-red-500 active:bg-red-500/20 active:scale-90 hover:text-red-400 hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors cursor-pointer">
                <i aria-hidden="true" class="fa-solid fa-trash-can text-sm"></i>
            </button>
        </li>
        `}
    ).join('')
}

export function setLoading(isLoading, source = 'search') {
    const targetIcon = source === 'location' ? elements.currentLocIcon : elements.searchBtnIcon
    const originalClass = source === 'location' ? 'fa-location-crosshairs' : 'fa-arrow-right'

    if (isLoading) {
        elements.searchInput.disabled = true
        elements.searchBtn.disabled = true
        elements.currentLocBtn.disabled = true

        targetIcon.classList.replace(originalClass, 'fa-spinner')
        targetIcon.classList.add('fa-spin')
    } else {
        elements.searchInput.disabled = false
        elements.searchBtn.disabled = false
        elements.currentLocBtn.disabled = false

        targetIcon.classList.replace('fa-spinner', originalClass)
        targetIcon.classList.remove('fa-spin')
    }
}