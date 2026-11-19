import './input.css';
import { elements, hideError, renderAQI, renderCurrentWeather, renderSavedLocations, renderWeeklyForecast, setLoading, showError, updateBookmarkUI, updateTime, updateUnitToggleUI } from "./ui.js";
import { getLocationData, getWeather, getAirQuality, getReverseLocationData } from "./api.js";
import { getPrimaryLocation, getSavedLocations, removeLocation, savePrimaryLocation, saveLocation } from './storage.js';

let currentUnit = 'fahrenheit'
let currentLocationData = null
let savedLocationsData = []

async function onSubmit(e) {
    e.preventDefault()
    hideError()
    setLoading(true, 'search')

    try {
        const cityName = elements.searchInput.value
    
        const { latitude, longitude, name, admin1, country_code } = await getLocationData(cityName)
    
        const [weatherData, airQualityData] = await Promise.all([
            getWeather(latitude, longitude, currentUnit),
            getAirQuality(latitude, longitude),
        ])

        currentLocationData = { latitude, longitude, name, admin1, country_code }
    
        renderCurrentWeather(weatherData, currentLocationData)
        updateBookmarkUI(currentLocationData)
        renderAQI(airQualityData)
        renderWeeklyForecast(weatherData)
        loadSavedLocations()

        window.scrollTo({ top: 0, behavior: 'smooth' })
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
        try {
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

        } catch (error) {
            console.error('Error loading initial location:', error)
            showError(error.message)
        }
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
        renderSavedLocations(savedLocationsData, currentLocationData)
        updateBookmarkUI(currentLocationData)

        window.scrollTo({ top: 0, behavior: 'smooth' })
        
    } catch (error) {
        console.error('Error loading weather data:', error)
        showError(error.message)
    } finally {
        setLoading(false, 'location')
    }
}

async function handleSaveLocationBtn(e) {
    try {
        const savedLocations = getSavedLocations()
        const isAlreadySaved = savedLocations.some(loc => loc.name === currentLocationData.name && loc.admin1 === currentLocationData.admin1)

        if (isAlreadySaved) {
            removeLocation(currentLocationData)
            localStorage.removeItem('primaryLocation')

            savedLocationsData = savedLocationsData.filter(loc => loc.name !== currentLocationData.name || loc.admin1 !== currentLocationData.admin1)
        } else {
            const weatherData = await getWeather(currentLocationData.latitude, currentLocationData.longitude, currentUnit)

            savePrimaryLocation(currentLocationData)
            saveLocation(currentLocationData)

            savedLocationsData = [...savedLocationsData, { ...currentLocationData, weatherData }]
        }

        updateBookmarkUI(currentLocationData)
        renderSavedLocations(savedLocationsData, currentLocationData)

    } catch (error) {
        console.error('Error saving or removing location:', error)
        showError(error.message)
    }
}

async function handleUnitToggle(e) {
    const selectedUnit = e.currentTarget.dataset.unit

    if (selectedUnit === currentUnit) {
        return
    } 

    if (!currentLocationData) return

    const { latitude, longitude } = currentLocationData

    try {
        const weatherData = await getWeather(latitude, longitude, selectedUnit)

        currentUnit = selectedUnit

        renderCurrentWeather(weatherData, currentLocationData)
        renderWeeklyForecast(weatherData)
        updateUnitToggleUI(currentUnit)
        await loadSavedLocations()
    } catch (error) {
        console.error('Error switching temperature units:', error)
        showError(error.message)
    }
}

async function loadSavedLocations() {
    const savedLocations = getSavedLocations()

    const results = await Promise.allSettled(
        savedLocations.map(async loc => {
            const weatherData = await getWeather(loc.latitude, loc.longitude, currentUnit)
            return { ...loc, weatherData }
        })
    )

    savedLocationsData = savedLocations.map((loc, index) => {
        const result = results[index]
        return result.status === 'fulfilled'
            ? result.value
            : { ...loc, weatherData: null }
    })

    renderSavedLocations(savedLocationsData, currentLocationData)
}

async function handleSavedLocationClick(e) {
    const locationCard = e.target.closest('li')
    if (!locationCard) return

    const { lat, long } = locationCard.dataset
    const savedLocations = getSavedLocations()

    // Handle delete button
    if (e.target.closest('button')) {
        locationCard.classList.add('scale-95', 'opacity-0', 'transition-all', 'duration-150')
        await new Promise(resolve => setTimeout(resolve, 150))

        const filteredLocations = savedLocations.filter(loc => loc.latitude !== +lat || loc.longitude !== +long)

        localStorage.setItem('savedLocations', JSON.stringify(filteredLocations))
        savedLocationsData = savedLocationsData.filter(loc => loc.latitude !== +lat || loc.longitude !== +long)
        renderSavedLocations(savedLocationsData, currentLocationData)

        if (currentLocationData) updateBookmarkUI(currentLocationData)
        return
    } 

    // Handle card selection
    const targetLocation = savedLocations.find(loc => loc.latitude === +lat && loc.longitude === +long)
    if (!targetLocation) return

    hideError()

    try {
        const [ weatherData, aqiData] = await Promise.all([
            getWeather(lat, long, currentUnit),
            getAirQuality(lat, long)
        ])

        currentLocationData = targetLocation
        savePrimaryLocation(currentLocationData)
    
        renderCurrentWeather(weatherData, targetLocation)
        renderAQI(aqiData)
        renderWeeklyForecast(weatherData)
        updateBookmarkUI(currentLocationData)
        renderSavedLocations(savedLocationsData, currentLocationData)
    
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
        console.error('Error loading saved location:', error)
        showError(error.message)
    }
}

async function init() {
    updateTime()
    setInterval(updateTime, 1000)

    // Event Listeners
    elements.searchForm.addEventListener('submit', onSubmit)
    elements.fahrenheitBtn.addEventListener('click', handleUnitToggle)
    elements.celsiusBtn.addEventListener('click', handleUnitToggle)
    elements.currentLocBtn.addEventListener('click', handleCurrentLocationClick)
    elements.saveLocationBtn.addEventListener('click', handleSaveLocationBtn)
    elements.savedLocationsContainer.addEventListener('click', handleSavedLocationClick)

    await loadInitialLocation()
    await loadSavedLocations()
}

init()