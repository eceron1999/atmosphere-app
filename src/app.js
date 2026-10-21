import { elements, renderCurrentWeather } from "./ui.js";
import { getCoordinates, getWeather, getAirQuality } from "./api.js";

async function onSubmit(e) {
    e.preventDefault()

    const cityName = elements.searchInput.value

    const { latitude, longitude } = await getCoordinates(cityName)

    const weatherData = await getWeather(latitude, longitude)
    const airQualityData = await getAirQuality(latitude, longitude)

    renderCurrentWeather(weatherData)
}

// Event Listeners
elements.searchForm.addEventListener('submit', onSubmit)