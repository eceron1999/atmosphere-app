const weatherCache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000

export async function getLocationData(cityName) {
    const trimmedName = cityName.trim()
    if (!trimmedName) throw new Error('Please enter a city name.')

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedName)}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()
     
    if (!data.results || data.results.length === 0) {
        throw new Error(`No results found for "${trimmedName}".`)
    }

    const { latitude, longitude, name, admin1, country_code } = data.results[0]

    return { latitude, longitude, name, admin1, country_code }
}

export async function getReverseLocationData(latitude, longitude) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()

    if (!data.city && !data.locality) {
        throw new Error('City not found!')
    }

    const { city, locality, principalSubdivision: admin1, countryCode: country_code } = data
    const name = city || locality

    return { name, admin1, country_code }
}

export async function getWeather(latitude, longitude, currentUnit) {
    const cacheKey = `${latitude},${longitude},${currentUnit}`
    const cached = weatherCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data
    }

    const url = `https://api.open-meteo.com/v1/forecast?daily=uv_index_max,temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&current=temperature_2m,wind_speed_10m,wind_direction_10m,apparent_temperature,relative_humidity_2m,weather_code&timezone=auto&temperature_unit=${currentUnit}&latitude=${latitude}&longitude=${longitude}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()

    weatherCache.set(cacheKey, { data, timestamp: Date.now() })
    
    return data
}

export async function getAirQuality(latitude, longitude) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide&timezone=auto&latitude=${latitude}&longitude=${longitude}`
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()

    return data
}