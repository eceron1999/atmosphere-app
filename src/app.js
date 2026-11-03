import './input.css';
import { elements, renderAQI, renderCurrentWeather, renderSavedLocations, renderWeeklyForecast, updateBookmarkUI, updateTime, updateUnitToggleUI } from "./ui.js";
import { getLocationData, getWeather, getAirQuality, getReverseLocationData } from "./api.js";
import { getSavedLocations, removeLocation, saveLocation } from './storage.js';

let currentUnit = 'fahrenheit'
let currentLat = null
let currentLong = null
let currentLocationData = null

async function onSubmit(e) {
    e.preventDefault()

    try {
        const cityName = elements.searchInput.value
    
        const { latitude, longitude, name, admin1, country_code } = await getLocationData(cityName)
    
        currentLat = latitude
        currentLong = longitude
        currentLocationData = { name, admin1, country_code }
    
        const [weatherData, airQualityData] = await Promise.all([
            getWeather(latitude, longitude, currentUnit),
            getAirQuality(latitude, longitude),
        ])
    
        renderCurrentWeather(weatherData, currentLocationData)
        updateBookmarkUI(currentLocationData)
        renderAQI(airQualityData)
        renderWeeklyForecast(weatherData)
    } catch (error) {
        console.error('Error loading weather data:', error)
        alert(`Could not load weather: ${error.message}`)
    }
}

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

async function handleCurrentLocationClick(e) {
    try {
        const currentPosition = await getCurrentPosition()
        const { latitude, longitude } = currentPosition.coords
        
        const [weatherData, currentLocationData, airQualityData] = await Promise.all([
            getWeather(latitude, longitude, currentUnit),
            getReverseLocationData(latitude, longitude),
            getAirQuality(latitude, longitude),
        ])

        renderCurrentWeather(weatherData, currentLocationData)
        renderAQI(airQualityData)
        renderWeeklyForecast(weatherData)
        
    } catch (error) {
        console.error('Error loading weather data:', error)
        alert(`Could not load weather: ${error.message}`)
    }
}

async function handleSaveLocationBtn(e) {
    const savedLocations = getSavedLocations()
    const isAlreadySaved = savedLocations.some(loc => loc.name === currentLocationData.name && loc.admin1 === currentLocationData.admin1)

    isAlreadySaved ? removeLocation(currentLocationData) : saveLocation(currentLocationData)
    
    updateBookmarkUI(currentLocationData)
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

function loadSavedLocations() {
    const savedLocations = getSavedLocations()

    renderSavedLocations(savedLocations)
}

function init() {
    updateTime()
    setInterval(updateTime, 1000)

    loadSavedLocations()

    // Event Listeners
    elements.searchForm.addEventListener('submit', onSubmit)
    elements.fahrenheitBtn.addEventListener('click', handleUnitToggle)
    elements.celsiusBtn.addEventListener('click', handleUnitToggle)
    elements.currentLocBtn.addEventListener('click', handleCurrentLocationClick)
    elements.saveLocationBtn.addEventListener('click', handleSaveLocationBtn)
}

init()