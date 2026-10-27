import './input.css';
import { elements, renderAQI, renderCurrentWeather, renderWeeklyForecast, updateTime, updateUnitToggleUI } from "./ui.js";
import { getLocationData, getWeather, getAirQuality } from "./api.js";

let currentUnit = 'fahrenheit'
let currentLat = null
let currentLong = null
let currentLocationData = null

async function onSubmit(e) {
    e.preventDefault()

    const cityName = elements.searchInput.value

    const { latitude, longitude, name, admin1, country_code } = await getLocationData(cityName)

    currentLat = latitude
    currentLong = longitude
    currentLocationData = { name, admin1, country_code }

    const weatherData = await getWeather(latitude, longitude, currentUnit)
    const airQualityData = await getAirQuality(latitude, longitude)

    renderCurrentWeather(weatherData, currentLocationData)
    renderAQI(airQualityData)
    renderWeeklyForecast(weatherData)
}

async function handleUnitToggle(e) {
    const selectedUnit = e.currentTarget.dataset.unit

    if (selectedUnit === currentUnit) {
        return
    } 

    currentUnit = selectedUnit

    const weatherData = await getWeather(currentLat, currentLong, currentUnit)

    renderCurrentWeather(weatherData, currentLocationData)

    updateUnitToggleUI(currentUnit)
}

function init() {
    updateTime()
    setInterval(updateTime, 1000)

    // Event Listeners
    elements.searchForm.addEventListener('submit', onSubmit)
    elements.fahrenheitBtn.addEventListener('click', handleUnitToggle)
    elements.celsiusBtn.addEventListener('click', handleUnitToggle)
}

init()