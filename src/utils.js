const weatherCodes = {
    0: {
        description: 'Clear Sky',
        icon: 'fa-sun'
    },
    1: {
        description: 'Mainly Clear',
        icon: 'fa-cloud-sun'
    },
    2: {
        description: 'Partly Cloudy',
        icon: 'fa-cloud-sun'
    },
    3: {
        description: 'Overcast',
        icon: 'fa-cloud-sun'
    },
    45: {
        description: 'Foggy',
        icon: 'fa-smog'
    },
    48: {
        description: 'Depositing Rime Fogt',
        icon: 'fa-smog'
    },
    51: {
        description: 'Light Drizzle',
        icon: 'fa-cloud-rain'
    },
    53: {
        description: 'Moderate Drizzle',
        icon: 'fa-cloud-rain'
    },
    55: {
        description: 'Dense Drizzle',
        icon: 'fa-cloud-rain'
    },
    61: {
        description: 'Slight Rain',
        icon: 'fa-cloud-rain'
    },
    63: {
        description: 'Moderate Rain',
        icon: 'fa-cloud-rain'
    },
    65: {
        description: 'Heavy Rain',
        icon: 'fa-cloud-showers-heavy'
    },
    71: {
        description: 'Slight Snow',
        icon: 'fa-snowflake'
    },
    73: {
        description: 'Moderate Snow',
        icon: 'fa-snowflake'
    },
    75: {
        description: 'Heavy Snow',
        icon: 'fa-snowflake'
    },
    80: {
        description: 'Slight Rain Showers',
        icon: 'fa-cloud-rain'
    },
    81: {
        description: 'Moderate Rain Showers',
        icon: 'fa-cloud-showers-heavy'
    },
    82: {
        description: 'Violent Rain Showers',
        icon: 'fa-cloud-showers-heavy'
    },
    95: {
        description: 'Thunderstorm',
        icon: 'fa-bolt'
    },
    96: {
        description: 'Thunderstorm With Slight Hail',
        icon: 'fa-bolt'
    },
    99: {
        description: 'Thunderstorm With Heavy Hail',
        icon: 'fa-bolt'
    },
}

export function getWeatherInfo(code) {
    if (code in weatherCodes) {
        return weatherCodes[code]
    } else {
        return {
            description: 'Unknown',
            icon: 'fa-question'
        }
    }
}

export function formatLocation({ name, admin1, country_code }) {
    console.log(name, admin1, country_code)
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
