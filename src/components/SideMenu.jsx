import React, { useState } from 'react'
import './SideMenu.css'

const SideMenu = ({ isOpen, onClose, onReportHazard, onSOS, onChangeDestination }) => {
  const [showHazardOptions, setShowHazardOptions] = useState(false)
  const [showSafetyGuidelines, setShowSafetyGuidelines] = useState(false)
  const [showHazardForm, setShowHazardForm] = useState(false)
  const [selectedHazardType, setSelectedHazardType] = useState('')
  const [hazardLocation, setHazardLocation] = useState('')
  const [hazardDescription, setHazardDescription] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false)
  const [validatedLocation, setValidatedLocation] = useState(null)

  const hazardTypes = [
    { id: 'accident', name: 'Traffic Accident', icon: '🚗💥' },
    { id: 'bridge-collapse', name: 'Bridge Collapse', icon: '🌉⚠️' },
    { id: 'flooding', name: 'Flooding', icon: '🌊' },
    { id: 'construction', name: 'Construction', icon: '🚧' },
    { id: 'other', name: 'Other Hazard', icon: '⚠️' }
  ]

  const safetyGuidelines = [
    { category: 'Car', rules: [
      'Always wear your seatbelt',
      'Maintain safe following distance',
      'Use turn signals properly',
      'Check mirrors regularly',
      'Don\'t use phone while driving'
    ]},
    { category: 'Motorcycle', rules: [
      'Always wear a helmet',
      'Wear protective gear',
      'Be extra visible to other drivers',
      'Check tire pressure regularly',
      'Avoid riding in bad weather'
    ]},
    { category: 'Bicycle', rules: [
      'Wear a helmet and reflective gear',
      'Use bike lanes when available',
      'Follow traffic signals',
      'Use lights when cycling at night',
      'Be predictable in your movements'
    ]},
    { category: 'Walking', rules: [
      'Use pedestrian crossings',
      'Look both ways before crossing',
      'Wear bright/reflective clothing at night',
      'Stay on sidewalks when available',
      'Make eye contact with drivers'
    ]}
  ]

  // Geocoding function for location suggestions
  const geocodeLocation = async (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([])
      return
    }

    setIsGeocodingLocation(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const suggestions = data.map(item => ({
          id: item.place_id,
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.address
        }))
        setLocationSuggestions(suggestions)
      } else {
        setLocationSuggestions([])
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setLocationSuggestions([])
    }
    setIsGeocodingLocation(false)
  }

  // Handle location input change with debounced geocoding
  const handleLocationChange = (value) => {
    setHazardLocation(value)
    setValidatedLocation(null)
    
    // Debounce the geocoding request
    clearTimeout(window.hazardLocationTimeout)
    window.hazardLocationTimeout = setTimeout(() => {
      geocodeLocation(value)
    }, 500)
  }

  // Handle location suggestion selection
  const handleLocationSelect = (suggestion) => {
    setHazardLocation(suggestion.displayName)
    setValidatedLocation(suggestion)
    setLocationSuggestions([])
  }

  const handleHazardSelect = (hazardType) => {
    setSelectedHazardType(hazardType)
    setShowHazardOptions(false)
    setShowHazardForm(true)
  }

  const handleHazardSubmit = () => {
    if (selectedHazardType && hazardLocation && hazardDescription && validatedLocation) {
      const hazardData = {
        type: selectedHazardType,
        location: hazardLocation,
        description: hazardDescription,
        coordinates: {
          lat: validatedLocation.lat,
          lng: validatedLocation.lng
        }
      }
      onReportHazard(hazardData)
      // Reset form
      setSelectedHazardType('')
      setHazardLocation('')
      setHazardDescription('')
      setValidatedLocation(null)
      setLocationSuggestions([])
      setShowHazardForm(false)
      onClose()
    } else if (!validatedLocation) {
      alert('Please select a valid location from the suggestions or wait for location validation.')
    }
  }

  const handleCancelHazard = () => {
    setShowHazardForm(false)
    setSelectedHazardType('')
    setHazardLocation('')
    setHazardDescription('')
    setValidatedLocation(null)
    setLocationSuggestions([])
  }

  return (
    <>
      {isOpen && <div className="menu-overlay" onClick={onClose} />}
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Safety Menu</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="menu-content">
          {showHazardForm ? (
            <div className="hazard-form">
              <h4>Report Hazard</h4>
              <div className="form-group">
                <label>Hazard Type:</label>
                <div className="selected-hazard">
                  {hazardTypes.find(h => h.id === selectedHazardType)?.icon} {hazardTypes.find(h => h.id === selectedHazardType)?.name}
                </div>
              </div>
              <div className="form-group">
                <label>Location/Area:</label>
                <div className="location-input-container">
                  <input
                    type="text"
                    value={hazardLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Enter specific location or landmark"
                    className={validatedLocation ? 'validated' : ''}
                  />
                  {isGeocodingLocation && (
                    <div className="geocoding-spinner">🔄</div>
                  )}
                  {validatedLocation && (
                    <div className="location-validated">
                      ✅ Location verified
                    </div>
                  )}
                  
                  {locationSuggestions.length > 0 && (
                    <div className="location-suggestions">
                      {locationSuggestions.map(suggestion => (
                        <div
                          key={suggestion.id}
                          className="suggestion-item"
                          onClick={() => handleLocationSelect(suggestion)}
                        >
                          <div className="suggestion-main">
                            📍 {suggestion.displayName.split(',').slice(0, 2).join(',')}
                          </div>
                          <div className="suggestion-detail">
                            {suggestion.displayName.split(',').slice(2).join(',').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={hazardDescription}
                  onChange={(e) => setHazardDescription(e.target.value)}
                  placeholder="Describe the hazard in detail"
                  rows="3"
                />
              </div>
              <div className="form-buttons">
                <button className="submit-btn" onClick={handleHazardSubmit}>
                  Submit Report
                </button>
                <button className="cancel-btn" onClick={handleCancelHazard}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="menu-section">
                <button 
                  className="menu-item"
                  onClick={() => setShowHazardOptions(!showHazardOptions)}
                >
                  <span className="menu-icon">📍</span>
                  <span className="menu-text">Report Hazard</span>
                  <span className="menu-arrow">{showHazardOptions ? '▼' : '▶'}</span>
                </button>
                
                {showHazardOptions && (
                  <div className="submenu">
                    {hazardTypes.map(hazard => (
                      <button
                        key={hazard.id}
                        className="submenu-item"
                        onClick={() => handleHazardSelect(hazard.id)}
                      >
                        <span className="hazard-icon">{hazard.icon}</span>
                        <span>{hazard.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="menu-section">
                <button 
                  className="menu-item"
                  onClick={() => setShowSafetyGuidelines(!showSafetyGuidelines)}
                >
                  <span className="menu-icon">📋</span>
                  <span className="menu-text">Safety Guidelines</span>
                  <span className="menu-arrow">{showSafetyGuidelines ? '▼' : '▶'}</span>
                </button>
                
                {showSafetyGuidelines && (
                  <div className="submenu safety-guidelines">
                    {safetyGuidelines.map(category => (
                      <div key={category.category} className="guideline-category">
                        <h4>{category.category} Safety</h4>
                        <ul>
                          {category.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="menu-section">
                <button className="menu-item emergency" onClick={onSOS}>
                  <span className="menu-icon">🆘</span>
                  <span className="menu-text">Emergency SOS</span>
                </button>
              </div>

              <div className="menu-section">
                <button className="menu-item" onClick={onChangeDestination}>
                  <span className="menu-icon">🏠</span>
                  <span className="menu-text">Change Destination</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SideMenu