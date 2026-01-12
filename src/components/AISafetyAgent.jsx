import React, { useState, useEffect } from 'react'
import './AISafetyAgent.css'

const AISafetyAgent = ({ 
  transportMode, 
  routeInfo, 
  routePolyline, 
  alternativeRoutes = [], 
  selectedRouteIndex = 0, 
  onRouteSelect,
  isNavigating, 
  onStartNavigation, 
  onStopNavigation, 
  onChangeDestination, 
  onSOS, 
  customAlert 
}) => {
  const [safetyPrompt, setSafetyPrompt] = useState('🤖 AI Safety Assistant Ready! Choose your route for personalized guidance.')
  const [currentInstruction, setCurrentInstruction] = useState('')
  const [instructionIndex, setInstructionIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded

  // Generate safety prompts based on transport mode
  const generateSafetyPrompt = (mode) => {
    const prompts = {
      car: [
        "🚗 Safety Check: Seatbelt on, mirrors adjusted, fuel adequate",
        "🛣️ Ready to go: Check traffic & weather conditions",
        "⚠️ Drive safely: Keep distance, follow speed limits",
        "🔋 Emergency ready: Phone charged, kit in vehicle"
      ],
      walking: [
        "🚶‍♂️ Walk safely: Wear visible clothes, use sidewalks",
        "📱 Stay connected: Phone charged, share your location",
        "🌤️ Weather ready: Dress right, carry water",
        "👀 Stay alert: Use crosswalks, watch traffic"
      ],
      bicycle: [
        "🚴‍♂️ Bike ready: Helmet on, lights working, brakes checked",
        "🦺 Be visible: Bright colors, follow traffic rules", 
        "🛣️ Ride smart: Use bike lanes, signal turns",
        "⚡ Stay prepared: Lights charged, repair kit ready"
      ],
      bike: [
        "🏍️ Ride safe: Helmet & gear on, bike inspected",
        "🔍 Pre-ride: Lights, brakes, tires all good",
        "⚠️ Defensive riding: Stay visible, keep distance",
        "🌦️ Weather aware: Adjust speed for conditions"
      ]
    }
    return prompts[mode] || prompts.car
  }

  // Generate turn-by-turn instructions from route geometry
  const generateInstructions = (polyline, mode) => {
    if (!polyline || polyline.length < 2) return []

    const instructions = []
    const totalDistance = calculateTotalDistance(polyline)
    
    // Add starting instruction
    instructions.push({
      distance: 0,
      instruction: getStartInstruction(mode),
      icon: '🚀'
    })

    // Generate intermediate instructions based on route segments
    for (let i = 1; i < polyline.length - 1; i += Math.max(1, Math.floor(polyline.length / 8))) {
      const prevPoint = polyline[i - 1]
      const currentPoint = polyline[i]
      const nextPoint = polyline[i + 1] || polyline[polyline.length - 1]
      
      const bearing = calculateBearing(prevPoint, currentPoint)
      const nextBearing = calculateBearing(currentPoint, nextPoint)
      const turn = calculateTurnDirection(bearing, nextBearing)
      const distance = Math.round(calculateDistance(polyline[0], currentPoint) * 1000) // meters

      if (turn !== 'straight' || i === 1) {
        instructions.push({
          distance,
          instruction: generateTurnInstruction(turn, distance, mode),
          icon: getTurnIcon(turn)
        })
      }
    }

    // Add final instruction
    const finalDistance = Math.round(totalDistance * 1000)
    instructions.push({
      distance: finalDistance,
      instruction: `🏁 You have arrived at your destination! Total distance: ${(totalDistance).toFixed(1)}km`,
      icon: '🏁'
    })

    return instructions
  }

  const getStartInstruction = (mode) => {
    const startInstructions = {
      car: "🚗 Start your engine and begin driving. Follow the highlighted route.",
      walking: "🚶‍♂️ Start walking along the designated path. Stay on sidewalks when available.",
      bicycle: "🚴‍♂️ Begin cycling. Use bike lanes and follow traffic rules.",
      bike: "🏍️ Start riding. Stay visible and maintain defensive positioning."
    }
    return startInstructions[mode] || startInstructions.car
  }

  const generateTurnInstruction = (direction, distance, mode) => {
    const verb = getMovementVerb(mode)
    
    const directions = {
      left: `↩️ ${verb} ${distance}m then turn LEFT`,
      right: `↪️ ${verb} ${distance}m then turn RIGHT`, 
      slight_left: `↖️ ${verb} ${distance}m then bear LEFT`,
      slight_right: `↗️ ${verb} ${distance}m then bear RIGHT`,
      straight: `⬆️ Continue ${verb} straight for ${distance}m`
    }
    return directions[direction] || directions.straight
  }

  const getMovementVerb = (mode) => {
    const verbs = {
      car: 'Drive',
      walking: 'Walk',
      bicycle: 'Cycle', 
      bike: 'Ride'
    }
    return verbs[mode] || 'Go'
  }

  const getTurnIcon = (direction) => {
    const icons = {
      left: '↩️',
      right: '↪️',
      slight_left: '↖️',
      slight_right: '↗️',
      straight: '⬆️'
    }
    return icons[direction] || '➡️'
  }

  // Calculate bearing between two points
  const calculateBearing = (point1, point2) => {
    const lat1 = point1[0] * Math.PI / 180
    const lat2 = point2[0] * Math.PI / 180
    const deltaLng = (point2[1] - point1[1]) * Math.PI / 180

    const x = Math.sin(deltaLng) * Math.cos(lat2)
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng)

    return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360
  }

  // Calculate turn direction from bearing change
  const calculateTurnDirection = (bearing1, bearing2) => {
    let diff = bearing2 - bearing1
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360

    if (Math.abs(diff) < 15) return 'straight'
    if (diff > 15 && diff < 45) return 'slight_right'
    if (diff >= 45) return 'right'
    if (diff < -15 && diff > -45) return 'slight_left'
    if (diff <= -45) return 'left'
    return 'straight'
  }

  // Calculate distance between two coordinates
  const calculateDistance = (point1, point2) => {
    const R = 6371 // Earth's radius in km
    const lat1 = point1[0] * Math.PI / 180
    const lat2 = point2[0] * Math.PI / 180
    const deltaLat = (point2[0] - point1[0]) * Math.PI / 180
    const deltaLng = (point2[1] - point1[1]) * Math.PI / 180

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  const calculateTotalDistance = (polyline) => {
    let total = 0
    for (let i = 1; i < polyline.length; i++) {
      total += calculateDistance(polyline[i-1], polyline[i])
    }
    return total
  }

  // Generate safety prompt when route is calculated
  useEffect(() => {
    if (routeInfo) {
      // If multiple routes available, provide comparison advice
      if (alternativeRoutes.length > 1) {
        const selectedRoute = alternativeRoutes[selectedRouteIndex]
        const routeComparison = alternativeRoutes.map(route => 
          `${route.name}: ${route.duration} (${route.safetyScore})`
        ).join(' | ')
        
        const comparisonPrompt = `🔄 Two routes available!

Selected: ${selectedRoute.name} (${selectedRoute.duration})
Safety Score: ${selectedRoute.safetyScore}

${selectedRoute.type === 'safest' ? '✅ Safer route - wider roads, fewer hazards' : 
  selectedRoute.type === 'fastest' ? '🚀 Fastest route - may have more traffic' : 
  '⚖️ Balanced route - good time & safety mix'}

💡 Click map routes to compare options`
        
        setSafetyPrompt(comparisonPrompt)
      } else {
        // Single route - use existing prompt generation
        const prompts = generateSafetyPrompt(transportMode)
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
        setSafetyPrompt(randomPrompt)
      }
      
      setIsExpanded(true)
      
      // Keep expanded - no auto-collapse
    }
  }, [routeInfo, transportMode, alternativeRoutes, selectedRouteIndex])

  // Generate navigation instructions
  useEffect(() => {
    if (routePolyline && isNavigating) {
      const instructions = generateInstructions(routePolyline, transportMode)
      console.log('🧭 Generated navigation instructions:', instructions)
      
      // Start with first instruction
      if (instructions.length > 0) {
        setCurrentInstruction(instructions[0].instruction)
        setInstructionIndex(0)
        
        // Simulate navigation progression
        let index = 0
        const navigationInterval = setInterval(() => {
          index++
          if (index < instructions.length) {
            setCurrentInstruction(instructions[index].instruction)
            setInstructionIndex(index)
          } else {
            clearInterval(navigationInterval)
            onStopNavigation()
          }
        }, 8000) // Change instruction every 8 seconds
        
        return () => clearInterval(navigationInterval)
      }
    }
  }, [routePolyline, isNavigating, transportMode])

  // Handle custom alerts from hazard reporting
  useEffect(() => {
    if (customAlert) {
      setSafetyPrompt(customAlert)
      setIsExpanded(true)
    }
  }, [customAlert])

  const handleStartNavigation = () => {
    if (routePolyline) {
      onStartNavigation()
      setIsExpanded(true)
    }
  }

  return (
    <div className={`ai-safety-agent ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="agent-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="agent-icon">🤖</div>
        <span className="agent-title">AI Safety Assistant</span>
        <div className="expand-icon">{isExpanded ? '▼' : '▶'}</div>
      </div>

      {isExpanded && (
        <div className="agent-content">
          {/* Always show safety prompt */}
          <div className="safety-prompt">
            <div className="prompt-icon">⚠️</div>
            <p className="prompt-text">{safetyPrompt}</p>
          </div>

          {/* Combined route selection and navigation controls */}
          {routeInfo && !isNavigating && alternativeRoutes.length > 0 && (
            <div className="combined-controls">
              {/* Route selection buttons on the left */}
              <div className="route-selection-section">
                <div className="section-label">Choose Route:</div>
                <div className="route-buttons">
                  {alternativeRoutes.map((route, index) => (
                    <button
                      key={route.id}
                      onClick={() => onRouteSelect && onRouteSelect(index)}
                      className={`route-btn ${index === selectedRouteIndex ? 'selected' : ''}`}
                    >
                      <span className="route-icon">
                        {route.type === 'fastest' ? '🚀' : route.type === 'safest' ? '🛡️' : '🔄'}
                      </span>
                      <span className="route-label">
                        {route.type === 'fastest' ? 'Fast' : route.type === 'safest' ? 'Safe' : 'Alt'}
                      </span>
                      <span className="route-time">{route.duration.split(' ')[0]}m</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route details in the middle */}
              <div className="route-details-section">
                <div className="section-label">Route Details:</div>
                <div className="route-stats">
                  <div className="stat-item">
                    <span className="stat-icon">📍</span>
                    <span className="stat-value">{routeInfo.distance}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⏱️</span>
                    <span className="stat-value">{routeInfo.duration}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🛡️</span>
                    <span className="stat-value">{routeInfo.safetyScore}</span>
                  </div>
                </div>
                {routeInfo.safetyFactors && routeInfo.safetyFactors.length > 0 && (
                  <div className="safety-factors">
                    <span className="factors-label">Safety:</span>
                    <span className="factors-text">{routeInfo.safetyFactors.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Navigation controls on the right */}
              <div className="navigation-section">
                <button 
                  className="start-navigation-btn" 
                  onClick={handleStartNavigation}
                >
                  🧭 Start Journey
                </button>
              </div>
            </div>
          )}

          {/* Action buttons - always visible when expanded */}
          <div className="action-buttons">
            <button 
              className="sos-btn" 
              onClick={onSOS}
              title="Emergency SOS"
            >
              🚨 SOS
            </button>
            <button 
              className="change-destination-btn" 
              onClick={onChangeDestination}
              title="Change Destination"
            >
              📍 Change Destination
            </button>
          </div>

          {isNavigating && currentInstruction && (
            <div className="navigation-instruction">
              <div className="instruction-header">
                <span className="nav-icon">🧭</span>
                <span className="nav-title">Navigation Active</span>
              </div>
              <p className="instruction-text">{currentInstruction}</p>
              <div className="navigation-controls">
                <button 
                  className="stop-navigation-btn" 
                  onClick={onStopNavigation}
                >
                  ⏹️ Stop Navigation
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AISafetyAgent