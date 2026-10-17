export async function getCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()

    if (!data.results || data.results.length === 0) {
        throw new Error('City not found!')
    }

    const latitude = data.results[0].latitude
    const longitude = data.results[0].longitude

    return { latitude, longitude }
}

export async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?daily=uv_index_max,temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&current=temperature_2m,wind_speed_10m,wind_direction_10m,apparent_temperature,relative_humidity_2m,weather_code&timezone=auto&temperature_unit=fahrenheit&latitude=${latitude}&longitude=${longitude}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()

    return data
}

export async function getAirQuality(latitude, longitude) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?current=ozone,nitrogen_dioxide,pm10,pm2_5&timezone=auto&latitude=${latitude}&longitude=${longitude}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()

    return data
}