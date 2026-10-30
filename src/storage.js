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