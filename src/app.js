import './input.css';
import { elements, renderCurrentWeather, updateTime } from "./ui.js";
import { getLocationData, getWeather, getAirQuality } from "./api.js";

async function onSubmit(e) {
    e.preventDefault()

    const cityName = elements.searchInput.value

    const { latitude, longitude, name, admin1, country_code } = await getLocationData(cityName)

    const locationData = { name, admin1, country_code}
    const weatherData = await getWeather(latitude, longitude)
    const airQualityData = await getAirQuality(latitude, longitude)

    renderCurrentWeather(weatherData, locationData)
}

function init() {
    updateTime()
    setInterval(updateTime, 1000)

    // Event Listeners
    elements.searchForm.addEventListener('submit', onSubmit)
}

init()