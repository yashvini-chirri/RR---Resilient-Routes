import React, { useState, useRef } from 'react'
import axios from 'axios'
import './LocationInput.css'

const LocationInput = ({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  showGPS = false, 
  onGPSClick 
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    onChange(inputValue)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (inputValue.length > 2) {
      setIsLoading(true)
      // Debounce API calls
      debounceRef.current = setTimeout(() => {
        searchPlaces(inputValue)
      }, 500)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsLoading(false)
    }
  }

  const searchPlaces = async (query) => {
    try {
      // First try: Photon API (free, good for Indian cities)
      try {
        const photonResponse = await axios.get(`https://photon.komoot.io/api/`, {
          params: {
            q: `${query}, India`,
            limit: 5
          }
        })

        if (photonResponse.data && photonResponse.data.features && photonResponse.data.features.length > 0) {
          const places = photonResponse.data.features.map((feature, index) => ({
            id: feature.properties.osm_id || index,
            display_name: `${feature.properties.name || feature.properties.street || feature.properties.city || query}, ${feature.properties.state || feature.properties.country || 'India'}`,
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0],
            address: feature.properties,
            index
          }))

          setSuggestions(places)
          setShowSuggestions(places.length > 0)
          setIsLoading(false)
          return
        }
      } catch (photonError) {
        console.log('Photon API failed, trying fallback...')
      }

      // Fallback: Enhanced Nominatim with better Indian city support
      const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: `${query}, India`,
          format: 'json',
          addressdetails: 1,
          limit: 5,
          countrycodes: 'in',
          extratags: 1,
        },
        headers: {
          'User-Agent': 'SafetyNavigationApp/1.0'
        }
      })

      const places = nominatimResponse.data.map((place, index) => ({
        id: place.place_id,
        display_name: place.display_name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        address: place.address,
        index
      }))

      setSuggestions(places)
      setShowSuggestions(places.length > 0)
      setIsLoading(false)
    } catch (error) {
      console.error('Error searching places:', error)
      setIsLoading(false)
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.display_name)
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.blur()
    
    // Store coordinates for later use
    console.log('Selected place:', {
      name: suggestion.display_name,
      coordinates: { lat: suggestion.lat, lng: suggestion.lon }
    })
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const formatDisplayName = (displayName) => {
    const parts = displayName.split(', ')
    return {
      main: parts[0] || displayName,
      secondary: parts.slice(1, 3).join(', ') || ''
    }
  }

  return (
    <div className="location-input-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="location-input-container">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className="location-input"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {showGPS && (
          <button
            className="gps-button"
            onClick={onGPSClick}
            disabled={isLoading}
            title="Get current location"
          >
            📍
          </button>
        )}
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion) => {
            const formatted = formatDisplayName(suggestion.display_name)
            return (
              <div
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-main">
                  {formatted.main}
                </div>
                <div className="suggestion-secondary">
                  {formatted.secondary}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LocationInput