import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TransportModeSelector from './TransportModeSelector'
import LocationInput from './LocationInput'
import './HomePage_dark.css'

const HomePage = ({ setRouteData, transportMode, setTransportMode }) => {
  const [currentLocation, setCurrentLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [showSafetyPrompt, setShowSafetyPrompt] = useState(false)
  const [safetyPromptText, setSafetyPromptText] = useState('')
  const navigate = useNavigate()

  // Generate safety prompts based on transport mode
  const generateSafetyPrompt = (mode) => {
    const prompts = {
      car: [
        "🚗 Before you drive: Check your fuel level, adjust mirrors, and ensure your phone is charged for navigation.",
        "🛣️ Road safety reminder: Keep a safe following distance, observe speed limits, and avoid using your phone while driving.",
        "⚠️ Vehicle check: Ensure your seatbelt is fastened and your route is planned. Drive defensively and stay alert!"
      ],
      walking: [
        "🚶‍♂️ Walking safety: Wear visible clothing, stay on sidewalks, and be aware of your surroundings at all times.",
        "📱 Stay connected: Keep your phone charged, share your location with someone, and avoid isolated areas.",
        "👀 Pedestrian alert: Use crosswalks, make eye contact with drivers, and avoid distractions like loud music."
      ],
      bicycle: [
        "🚴‍♂️ Cycling safety: Ensure your helmet is secured, bike lights are working, and brakes are functioning properly.",
        "🦺 Be visible: Wear bright colors, use reflectors, and follow all traffic rules. Signal your turns clearly.",
        "🛣️ Route planning: Use bike lanes when available, watch for car doors, and maintain a safe distance from vehicles."
      ],
      bike: [
        "🏍️ Motorcycle safety: Wear proper protective gear including helmet, gloves, and reflective clothing.",
        "🔍 Pre-ride inspection: Check lights, brakes, tires, mirrors, and fluid levels before starting your journey.",
        "⚠️ Defensive riding: Assume you're invisible to other drivers, maintain escape routes, and follow at a safe distance."
      ]
    }
    const modePrompts = prompts[mode] || prompts.car
    return modePrompts[Math.floor(Math.random() * modePrompts.length)]
  }

  const handleGetCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Reverse geocode to get address
          setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get current location. Please enter manually.')
          setLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
      setLoading(false)
    }
  }

  const handleFindRoute = () => {
    if (!currentLocation || !destination) {
      alert('Please fill in both location fields')
      return
    }

    // Show safety prompt based on transport mode
    const prompt = generateSafetyPrompt(transportMode)
    setSafetyPromptText(prompt)
    setShowSafetyPrompt(true)

    // Auto-hide prompt after 4 seconds and proceed to route
    setTimeout(() => {
      setShowSafetyPrompt(false)
      proceedToRoute()
    }, 4000)
  }

  const proceedToRoute = () => {
    setLoading(true)

    const routeData = {
      from: currentLocation,
      to: destination,
      mode: transportMode,
      timestamp: Date.now()
    }

    setRouteData(routeData)
    setLoading(false)
    navigate('/map')
  }

  return (
    <div className="home-page">
      {/* Header with menu and AI buttons */}
      <header className="app-header">
        <button 
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="app-title">Resilient Routes</h1>
        <button 
          className="ai-button"
          onClick={() => setAiOpen(true)}
          aria-label="Open AI Assistant"
        >
          🤖
        </button>
      </header>

      {/* Safety Prompt Modal */}
      {showSafetyPrompt && (
        <div className="safety-prompt-overlay">
          <div className="safety-prompt-modal">
            <div className="safety-prompt-header">
              <span className="safety-icon">🤖</span>
              <h3>AI Safety Assistant</h3>
            </div>
            <div className="safety-prompt-content">
              <p>{safetyPromptText}</p>
            </div>
            <div className="safety-prompt-footer">
              <div className="loading-spinner"></div>
              <span>Preparing your safe route...</span>
            </div>
          </div>
        </div>
      )}

      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Navigate Safely, Arrive Securely</h2>
            <p className="hero-subtitle">AI-powered route planning with real-time safety analysis</p>
          </div>
        </div>

        <div className="input-section">
          <LocationInput
            id="currentLocation"
            label="Current Location"
            placeholder="Enter starting address or use GPS"
            value={currentLocation}
            onChange={setCurrentLocation}
            showGPS={true}
            onGPSClick={handleGetCurrentLocation}
          />

          <LocationInput
            id="destination"
            label="Destination"
            placeholder="Where do you want to go?"
            value={destination}
            onChange={setDestination}
          />

          <TransportModeSelector 
            selectedMode={transportMode}
            onModeSelect={setTransportMode}
          />

          <button
            className="find-route-button"
            onClick={handleFindRoute}
            disabled={loading || !currentLocation || !destination}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Calculating Safe Route...
              </>
            ) : (
              <>
                <span className="button-icon">🗺️</span>
                Find Safest Route
              </>
            )}
          </button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Safety First</h3>
            <p className="feature-description">AI analyzes crime data, traffic patterns, and road conditions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Real-time Alerts</h3>
            <p className="feature-description">Live updates on hazards, accidents, and road closures</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Assistant</h3>
            <p className="feature-description">Smart companion for personalized safety advice</p>
          </div>
        </div>
      </div>

      {/* TODO: Add Side Menu and AI Assistant components */}
    </div>
  )
}

export default HomePage
