export function getSavedLocations() {
    const getLocations = localStorage.getItem('savedLocations')

    if (!getLocations) return []

    try {
        return JSON.parse(getLocations)
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

export function removeLocation(location) {
    const savedLocations = getSavedLocations()
    const filteredLocations = savedLocations.filter(loc => !(loc.name === location.name && loc.admin1 === location.admin1))

    localStorage.setItem('savedLocations', JSON.stringify(filteredLocations))
}