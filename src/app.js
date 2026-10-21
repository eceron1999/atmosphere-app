import { elements, renderCurrentWeather } from "./ui.js";
import { getLocationData, getWeather, getAirQuality } from "./api.js";

async function onSubmit(e) {
    e.preventDefault()

    const cityName = elements.searchInput.value

    const { latitude, longitude, name, admin1, country } = await getLocationData(cityName)

    const locationData = { name, admin1, country}
    const weatherData = await getWeather(latitude, longitude)
    const airQualityData = await getAirQuality(latitude, longitude)

    renderCurrentWeather(weatherData, locationData)
}

// Event Listeners
elements.searchForm.addEventListener('submit', onSubmit)