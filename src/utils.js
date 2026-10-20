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

export function formatDayName(dateString) {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', { weekday: 'short' })
}