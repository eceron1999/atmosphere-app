const weatherStyles = {
    clear: { icon: 'fa-sun', color: 'text-amber-400' },
    partlyCloudy: { icon: "fa-cloud-sun", color: "text-amber-300" },
    overcast: { icon: "fa-cloud", color: "text-slate-400" },
    fog: { icon: "fa-smog", color: "text-slate-300" },
    drizzle: { icon: "fa-cloud-sun-rain", color: "text-sky-400" },
    rain: { icon: "fa-cloud-rain", color: "text-blue-400" },
    heavyRain: { icon: "fa-cloud-showers-heavy", color: "text-blue-500" },
    snow: { icon: "fa-snowflake", color: "text-cyan-300" },
    thunder: { icon: "fa-cloud-bolt", color: "text-purple-400" }
}

const weatherCodes = {
    0: { description: 'Clear Sky', ...weatherStyles.clear },
    1: { description: 'Mainly Clear', ...weatherStyles.clear },
    2: { description: 'Partly Cloudy', ...weatherStyles.partlyCloudy },
    3: { description: 'Overcast', ...weatherStyles.overcast },
    45: { description: 'Foggy', ...weatherStyles.fog },
    48: { description: 'Smog', ...weatherStyles.fog },
    51: { description: 'Light Drizzle', ...weatherStyles.drizzle },
    53: { description: 'Moderate Drizzle', ...weatherStyles.drizzle },
    55: { description: 'Dense Drizzle', ...weatherStyles.drizzle },
    61: { description: 'Slight Rain', ...weatherStyles.rain },
    63: { description: 'Moderate Rain', ...weatherStyles.rain },
    65: { description: 'Heavy Rain', ...weatherStyles.heavyRain},
    71: { description: 'Slight Snow', ...weatherStyles.snow },
    73: { description: 'Moderate Snow', ...weatherStyles.snow },
    75: { description: 'Heavy Snow', ...weatherStyles.snow },
    80: { description: 'Slight Rain Showers', ...weatherStyles.rain },
    81: { description: 'Moderate Rain Showers', ...weatherStyles.heavyRain },
    82: { description: 'Violent Rain Showers', ...weatherStyles.heavyRain },
    95: { description: 'Thunderstorm', ...weatherStyles.thunder },
    96: { description: 'Thunderstorm With Slight Hail', ...weatherStyles.thunder },
    99: { description: 'Thunderstorm With Heavy Hail', ...weatherStyles.thunder },
}

export function getWeatherInfo(code) {
    if (code in weatherCodes) {
        return weatherCodes[code]
    } else {
        return {
            description: 'Unknown',
            icon: 'fa-question',
            color: 'text-slate-400'
        }
    }
}

export function formatLocation({ name, admin1, country_code }) {
    let html = `<span>${name}</span>`

    if (admin1) {
        html += `<span class='hidden sm:inline'>, ${admin1}</span>`
    }

    if (country_code) {
        html += `<span class='show-country'>, ${country_code}</span>`
    }

    return html.trim()
}

export function getFormattedCurrentTime() {
    const currentTime = new Date()

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })

    return formattedTime
}
export function getWindDirection(degree) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

    const degreeIndex = Math.round(degree / 45) % 8

    return directions[degreeIndex]
}

export function getUvDetails(uvIndex) {
    const levels = [
        { max: 2, text: 'Low', color: 'emerald' },
        { max: 5, text: 'Moderate', color: 'amber' },
        { max: 7, text: 'High', color: 'orange' },
        { max: 10, text: 'Very High', color: 'red' },
        { max: Infinity, text: 'Extreme', color: 'purple' },
    ]

    const currentLevel = levels.find(l => uvIndex <= l.max)

    const colorMap = {
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40",
        red: "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40"
    }

    const baseClasses = 'px-2 py-0.5 text-[10px] font-medium border rounded-full transition-colors duration-200'

    return {
        text: currentLevel.text,
        className: `${baseClasses} ${colorMap[currentLevel.color]}`
    }
}

export function formatDayName(dateString) {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', { weekday: 'short' })
}
