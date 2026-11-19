const WEATHER_STYLES = {
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

const WEATHER_CODES = {
    0: { description: 'Clear Sky', ...WEATHER_STYLES.clear },
    1: { description: 'Mainly Clear', ...WEATHER_STYLES.clear },
    2: { description: 'Partly Cloudy', ...WEATHER_STYLES.partlyCloudy },
    3: { description: 'Overcast', ...WEATHER_STYLES.overcast },
    45: { description: 'Foggy', ...WEATHER_STYLES.fog },
    48: { description: 'Freezing Fog', ...WEATHER_STYLES.fog },
    51: { description: 'Light Drizzle', ...WEATHER_STYLES.drizzle },
    53: { description: 'Moderate Drizzle', ...WEATHER_STYLES.drizzle },
    55: { description: 'Dense Drizzle', ...WEATHER_STYLES.drizzle },
    56: { description: 'Light Freezing Drizzle', ...WEATHER_STYLES.drizzle },
    57: { description: 'Dense Freezing Drizzle', ...WEATHER_STYLES.drizzle },
    61: { description: 'Slight Rain', ...WEATHER_STYLES.rain },
    63: { description: 'Moderate Rain', ...WEATHER_STYLES.rain },
    65: { description: 'Heavy Rain', ...WEATHER_STYLES.heavyRain},
    66: { description: 'Light Freezing Rain', ...WEATHER_STYLES.rain },
    67: { description: 'Heavy Freezing Rain', ...WEATHER_STYLES.heavyRain },
    71: { description: 'Slight Snow', ...WEATHER_STYLES.snow },
    73: { description: 'Moderate Snow', ...WEATHER_STYLES.snow },
    75: { description: 'Heavy Snow', ...WEATHER_STYLES.snow },
    77: { description: 'Snow Grains', ...WEATHER_STYLES.snow },
    80: { description: 'Slight Showers', ...WEATHER_STYLES.rain },
    81: { description: 'Moderate Showers', ...WEATHER_STYLES.heavyRain },
    82: { description: 'Violent Showers', ...WEATHER_STYLES.heavyRain },
    85: { description: 'Light Snow Showers', ...WEATHER_STYLES.snow },
    86: { description: 'Heavy Snow Showers', ...WEATHER_STYLES.snow },
    95: { description: 'Thunderstorm', ...WEATHER_STYLES.thunder },
    96: { description: 'Thunderstorm With Slight Hail', ...WEATHER_STYLES.thunder },
    97: { description: 'Heavy Thunderstorm', ...WEATHER_STYLES.thunder },
    99: { description: 'Thunderstorm With Heavy Hail', ...WEATHER_STYLES.thunder },
}

const AQI_THRESHOLDS = [
    { minAQI: 0, maxAQI: 50, status: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.', badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', messageColor: 'bg-emerald-500/10 border-emerald-500/20' },
    { minAQI: 51, maxAQI: 100, status: 'Moderate', description: 'Air quality is acceptable. However, sensitive groups may experience a moderate health concern.', badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30', messageColor: 'bg-amber-500/10 border-amber-500/20' },
    { minAQI: 101, maxAQI: 150, status: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.', badgeColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30', messageColor: 'bg-orange-500/10 border-orange-500/20' },
    { minAQI: 151, maxAQI: 200, status: 'Unhealthy', description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.', badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30', messageColor: 'bg-red-500/10 border-red-500/20' },
    { minAQI: 201, maxAQI: 300, status: 'Very Unhealthy', description: 'Health alert: everyone may experience more serious health effects.', badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30', messageColor: 'bg-rose-500/10 border-rose-500/20' },
    { minAQI: 301, maxAQI: 500, status: 'Hazardous', description: 'Health warnings of emergency conditions. The entire population is more likely to be affected.', badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30', messageColor: 'bg-purple-500/10 border-purple-500/20' },
]

export function getWeatherInfo(code) {
    if (code in WEATHER_CODES) {
        return WEATHER_CODES[code]
    } else {
        return {
            description: 'Unknown',
            icon: 'fa-question',
            color: 'text-slate-400'
        }
    }
}

export function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char])
}

export function formatLocation({ name, admin1, country_code }) {
    let html = `<span>${escapeHTML(name)}</span>`

    if (admin1 && admin1 !== name) {
        // Mobile devices
        html += `<span class='block mt-0.5 text-sm font-normal text-text-muted sm:hidden'>${escapeHTML(admin1)}</span>`
        // Small screens+
        html += `<span class='hidden sm:inline'>, ${escapeHTML(admin1)}</span>`
    }

    if (country_code) {
        html += `<span class='show-country'>, ${escapeHTML(country_code)}</span>`
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

    const baseClasses = 'px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors duration-200 min-[900px]:px-1.5! lg:px-2!'

    return {
        text: currentLevel.text,
        className: `${baseClasses} ${colorMap[currentLevel.color]}`
    }
}

export function getAqiStatus(aqiValue) {
    if (!Number.isFinite(aqiValue) || aqiValue < 0 || aqiValue > 500) {
        return {
            status: 'Unavailable',
            description: 'Air quality data is currently unavailable.',
            badgeColor: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
            messageColor: 'bg-slate-500/10 border-slate-500/20'
        }
    }
    
    const status = AQI_THRESHOLDS.find(threshold =>
        threshold.minAQI <= aqiValue && aqiValue <= threshold.maxAQI
    )

    return status || {
        status: 'Unavailable',
        description: 'Air quality data is currently unavailable.',
        badgeColor: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        messageColor: 'bg-slate-500/10 border-slate-500/20'
    }
}

export function getMainPollutant(airQualityData) {
    const aqiValues = [
        {name: 'PM2.5', value: airQualityData.current.pm2_5},
        {name: 'PM10', value: airQualityData.current.pm10},
        {name: 'O3', value: airQualityData.current.ozone},
        {name: 'NO2', value: airQualityData.current.nitrogen_dioxide},
    ]

    return aqiValues.reduce((acc, current) => 
        current.value > acc.value ? current : acc)
}

export function getAqiPercent(aqiNum) {
    if (!Number.isFinite(aqiNum) || aqiNum < 0 || aqiNum > 500) {
        return 0
    }

    const aqiPercent = (aqiNum / 500) * 100
    return Math.max(0, Math.min(100, aqiPercent))
}

export function formatDayName(dateString) {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function getTempPercent(current, min, max) {
    if (min === max) return 50

    const tempPercent = ((current - min) / (max - min)) * 100
    const clampedPercent = Math.max(0, Math.min(100, tempPercent))

    return clampedPercent
}