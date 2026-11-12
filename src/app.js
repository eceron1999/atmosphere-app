import './input.css';
import { elements, hideError, renderAQI, renderCurrentWeather, renderSavedLocations, renderWeeklyForecast, setLoading, showError, updateBookmarkUI, updateTime, updateUnitToggleUI } from "./ui.js";
import { getLocationData, getWeather, getAirQuality, getReverseLocationData } from "./api.js";
import { getPrimaryLocation, getSavedLocations, removeLocation, savePrimaryLocation, saveLocation } from './storage.js';
import { getWeatherInfo } from './utils.js';

let currentUnit = 'fahrenheit'
let currentLocationData = null

async function onSubmit(e) {
    e.preventDefault()
    hideError()
    setLoading(true, 'search')

    try {
        const cityName = elements.searchInput.value
    
        const { latitude, longitude, name, admin1, country_code } = await getLocationData(cityName)
    
        currentLocationData = { latitude, longitude, name, admin1, country_code }
        
    
        const [weatherData, airQualityData] = await Promise.all([
            getWeather(latitude, longitude, currentUnit),
            getAirQuality(latitude, longitude),
        ])
    
        renderCurrentWeather(weatherData, currentLocationData)
        updateBookmarkUI(currentLocationData)
        renderAQI(airQualityData)
        renderWeeklyForecast(weatherData)
        loadSavedLocations()
    } catch (error) {
        console.error('Error loading weather data:', error)
        showError(error.message)
    } finally {
        setLoading(false, 'search')
    }
}

async function loadInitialLocation() {
    const primaryLocation = getPrimaryLocation()

    if (primaryLocation) {
        const { latitude, longitude } = primaryLocation

        const [weatherData, locationData, airQualityData] = await Promise.all([
            getWeather(latitude, longitude, currentUnit),
            getReverseLocationData(latitude, longitude),
            getAirQuality(latitude, longitude),
        ])

        currentLocationData = {
            latitude,
            longitude, 
            ...locationData
        }

        renderCurrentWeather(weatherData, currentLocationData)
        renderAQI(airQualityData)
        renderWeeklyForecast(weatherData)
        updateBookmarkUI(currentLocationData)
    } else {
        await handleCurrentLocationClick()
    }
}

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

async function handleCurrentLocationClick(e) {
    hideError()
    setLoading(true, 'location')

    try {
        const currentPosition = await getCurrentPosition()
        const { latitude, longitude } = currentPosition.coords
        
        const [weatherData, locationData, airQualityData] = await Promise.all([
            getWeather(latitude, longitude, currentUnit),
            getReverseLocationData(latitude, longitude),
            getAirQuality(latitude, longitude),
        ])

        currentLocationData = {
            latitude,
            longitude,
            ...locationData
        }
        savePrimaryLocation(currentLocationData)

        renderCurrentWeather(weatherData, currentLocationData)
        renderAQI(airQualityData)
        renderWeeklyForecast(weatherData)
        loadSavedLocations()
        updateBookmarkUI(currentLocationData)
        
    } catch (error) {
        console.error('Error loading weather data:', error)
        showError(error.message)
    } finally {
        setLoading(false, 'location')
    }
}

async function handleSaveLocationBtn(e) {
    const savedLocations = getSavedLocations()
    const isAlreadySaved = savedLocations.some(loc => loc.name === currentLocationData.name && loc.admin1 === currentLocationData.admin1)

    if (isAlreadySaved) {
        removeLocation(currentLocationData)
        localStorage.removeItem('primaryLocation')
    } else {
        const weatherData = await getWeather(currentLocationData.latitude, currentLocationData.longitude, currentUnit)
        const locationToSave = {
            ...currentLocationData,
            weatherData
        }

        savePrimaryLocation(currentLocationData)
        saveLocation(locationToSave)
    }
    
    updateBookmarkUI(currentLocationData)
    loadSavedLocations()
}

async function handleUnitToggle(e) {
    const selectedUnit = e.currentTarget.dataset.unit

    if (selectedUnit === currentUnit) {
        return
    } 

    currentUnit = selectedUnit
    const { latitude, longitude } = currentLocationData

    const weatherData = await getWeather(latitude, longitude, currentUnit)

    renderCurrentWeather(weatherData, currentLocationData)
    updateUnitToggleUI(currentUnit)
    loadSavedLocations()
}

async function loadSavedLocations() {
    const savedLocations = getSavedLocations()

    const hydratedLocations = await Promise.all(
        savedLocations.map(async loc => {
            const weatherData = await getWeather(loc.latitude, loc.longitude, currentUnit)
            return { ...loc, weatherData}
        })
    )

    renderSavedLocations(hydratedLocations, currentLocationData)
}

async function handleSavedLocationClick(e) {
    const locationCard = e.target.closest('li')
    if (!locationCard) return

    const { lat, long } = locationCard.dataset
    const savedLocations = getSavedLocations()

    if (e.target.closest('button')) {
        locationCard.classList.add('scale-95', 'opacity-0', 'transition-all', 'duration-150')
        await new Promise(resolve => setTimeout(resolve, 150))

        const filteredLocations = savedLocations.filter(loc => loc.latitude !== +lat && loc.longitude !== +long)

        localStorage.setItem('savedLocations', JSON.stringify(filteredLocations))
        
        renderSavedLocations(filteredLocations, currentLocationData)

        if (currentLocationData) updateBookmarkUI(currentLocationData)
    } else {
        const targetLocation = savedLocations.find(loc => loc.latitude === +lat && loc.longitude === +long)
        if (!targetLocation) return

        currentLocationData = targetLocation
        savePrimaryLocation(currentLocationData)

        const weatherData = await getWeather(lat, long, currentUnit)
        const aqiData = await getAirQuality(lat, long)

        renderCurrentWeather(weatherData, targetLocation)
        renderAQI(aqiData)
        renderWeeklyForecast(weatherData)
        updateBookmarkUI(currentLocationData)
        loadSavedLocations()
    }
}

async function init() {
    updateTime()
    setInterval(updateTime, 1000)

    await loadInitialLocation()
    await loadSavedLocations()

    // Event Listeners
    elements.searchForm.addEventListener('submit', onSubmit)
    elements.fahrenheitBtn.addEventListener('click', handleUnitToggle)
    elements.celsiusBtn.addEventListener('click', handleUnitToggle)
    elements.currentLocBtn.addEventListener('click', handleCurrentLocationClick)
    elements.saveLocationBtn.addEventListener('click', handleSaveLocationBtn)
    elements.savedLocationsContainer.addEventListener('click', handleSavedLocationClick)
}

init()