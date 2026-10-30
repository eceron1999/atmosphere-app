export function getSavedLocations() {
    const getLocations = localStorage.getItem('SavedLocations')

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