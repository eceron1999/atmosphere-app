export function getSavedLocations() {
    const getLocations = localStorage.getItem('savedLocations')

    if (!getLocations) return []

    try {
        const savedLocations = JSON.parse(getLocations)
        return Array.isArray(savedLocations) ? savedLocations : []
    } catch (error) {
        console.error('Failed to parse saved locations from localStorage', error)
        return []
    }
}

export function saveLocation(location) {
    const savedLocations = getSavedLocations()
    const updatedLocations = [...savedLocations, location]

    localStorage.setItem('savedLocations', JSON.stringify(updatedLocations))
}

export function savePrimaryLocation(locationData) {
    localStorage.setItem('primaryLocation', JSON.stringify(locationData))
}

export function getPrimaryLocation() {
    const primaryLocation = localStorage.getItem('primaryLocation')

    if (!primaryLocation) return null

    try {
        return JSON.parse(primaryLocation)
    } catch (error) {
        console.error('Failed to parse primary location from localStorage', error)
        return null
    }
}

export function removeLocation(location) {
    const savedLocations = getSavedLocations()
    const filteredLocations = savedLocations.filter(loc => !(loc.name === location.name && loc.admin1 === location.admin1))

    localStorage.setItem('savedLocations', JSON.stringify(filteredLocations))
}