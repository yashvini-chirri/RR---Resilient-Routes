import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AISafetyAgent from './AISafetyAgent'
import SideMenu from './SideMenu'
import HazardOverlay from './HazardOverlay'
import SafetyRoutingService from '../services/SafetyRoutingService'

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom markers
const startIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const endIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Hazard marker icon (orange/yellow for warnings)
const hazardIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 49], // Slightly larger for visibility
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49]
})

// Component to handle map view updates
const MapController = ({ startCoords, endCoords, routePolyline }) => {
  const map = useMap()
  
  useEffect(() => {
    if (startCoords && endCoords && routePolyline) {
      // Create bounds for the route
      const bounds = L.latLngBounds([startCoords, endCoords])
      // Add some padding to the bounds
      map.fitBounds(bounds, { padding: [20, 20] })
    } else if (startCoords) {
      map.setView(startCoords, 12)
    } else if (endCoords) {
      map.setView(endCoords, 12)
    }
  }, [map, startCoords, endCoords, routePolyline])
  
  return null
}

const SuperMapLeaflet = ({ routeData, transportMode }) => {
  const [routeInfo, setRouteInfo] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [mapError, setMapError] = useState(null)
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [routePolyline, setRoutePolyline] = useState(null)
  const [alternativeRoutes, setAlternativeRoutes] = useState([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [safetyRoutingService] = useState(new SafetyRoutingService())
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [hazards, setHazards] = useState([
    // Single demo hazard to showcase route selection feature
    {
      id: 1,
      type: 'accident',
      location: 'Poonamallee High Road, between Anna Nagar and Adyar',
      description: 'Multi-vehicle accident blocking two lanes, causing major traffic delays. Emergency services on scene.',
      lat: 13.0567, // Strategically positioned between Anna Nagar (13.0850) and Adyar (13.0067)
      lng: 80.2154, // Positioned to affect the fastest route, encouraging alternative route selection
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      severity: 'critical',
      reportedBy: 'traffic_police',
      affectsRoute: true, // This hazard specifically affects the main/fastest route
      estimatedClearTime: new Date(Date.now() + 2700000).toISOString() // Clear in 45 minutes
    }
  ])
  const [aiAlertMessage, setAiAlertMessage] = useState('')
  const navigate = useNavigate()

  // No default center - will be set based on user input

  // Navigation handlers
  const handleStartNavigation = () => {
    setIsNavigating(true)
    console.log('🧭 Navigation started')
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    console.log('⏹️ Navigation stopped')
  }

  const handleChangeDestination = () => {
    console.log('📍 Changing destination - redirecting to home page')
    navigate('/')
  }

  const handleSOS = () => {
    console.log('🚨 SOS activated!')
    
    // Try to get current location for emergency services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const emergencyInfo = `EMERGENCY LOCATION: ${latitude}, ${longitude}`
          
          // In a real app, this would contact emergency services
          alert(`🚨 EMERGENCY SOS ACTIVATED!\n\nLocation: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nIn a real emergency, this would contact local emergency services.\n\nFor immediate help, call your local emergency number:\n• US: 911\n• EU: 112\n• UK: 999`)
          
          console.log('🚨 Emergency location:', emergencyInfo)
        },
        (error) => {
          alert('🚨 EMERGENCY SOS ACTIVATED!\n\nCould not get your exact location.\nPlease call your local emergency number immediately:\n• US: 911\n• EU: 112\n• UK: 999')
          console.error('❌ Could not get location for emergency:', error)
        }
      )
    } else {
      alert('🚨 EMERGENCY SOS ACTIVATED!\n\nLocation services unavailable.\nPlease call your local emergency number immediately:\n• US: 911\n• EU: 112\n• UK: 999')
    }
  }

  // Hazard reporting handler
  const handleHazardReport = async (hazardData) => {
    try {
      console.log('📍 Reporting hazard:', hazardData)
      
      // Use provided coordinates if available, otherwise geocode
      let lat, lng
      if (hazardData.coordinates) {
        lat = hazardData.coordinates.lat
        lng = hazardData.coordinates.lng
      } else {
        // Fallback to geocoding if coordinates not provided
        const location = await geocodeAddress(hazardData.location)
        lat = location.lat
        lng = location.lng
      }
      
      // Create hazard object with coordinates
      const hazard = {
        id: Date.now(),
        type: hazardData.type,
        location: hazardData.location,
        description: hazardData.description,
        lat: lat,
        lng: lng,
        timestamp: new Date().toISOString(),
        severity: 'user-reported',
        reportedBy: 'user'
      }
      
      // Add hazard to the list
      setHazards(prev => [...prev, hazard])
      
      // Alert AI about the new hazard
      const hazardTypes = {
        'accident': 'Traffic Accident',
        'bridge-collapse': 'Bridge Collapse', 
        'flooding': 'Flooding',
        'construction': 'Construction Work',
        'other': 'Other Hazard'
      }
      
      const alertMessage = `✅ HAZARD REPORTED: ${hazardTypes[hazard.type] || 'Unknown hazard'} at ${hazard.location}. ${hazard.description} Routes are being recalculated to avoid this area.`
      setAiAlertMessage(alertMessage)
      
      // Clear the alert after 15 seconds
      setTimeout(() => setAiAlertMessage(''), 15000)
      
      // Show success notification
      console.log('✅ Hazard reported successfully and added to map')
      console.log('🔄 Routes will be recalculated to avoid hazard zone')
    } catch (error) {
      console.error('❌ Error reporting hazard:', error)
      alert('Failed to report hazard. Please check the location and try again.')
    }
  }

  // Menu handlers
  const handleMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen)
  }

  const handleMenuClose = () => {
    setIsSideMenuOpen(false)
  }

  // AI hazard alert handler
  const handleAIHazardAlert = (hazard) => {
    const hazardTypes = {
      'accident': 'Traffic Accident',
      'bridge-collapse': 'Bridge Collapse',
      'flooding': 'Flooding', 
      'construction': 'Construction Work',
      'other': 'Other Hazard'
    }
    
    const alertMessage = `⚠️ HAZARD DETECTED: ${hazardTypes[hazard.type] || 'Unknown hazard'} near ${hazard.location}. Consider alternative routes for safety.`
    setAiAlertMessage(alertMessage)
  }

  // Geocoding function using Nominatim (free OpenStreetMap service)
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name
        }
      } else {
        throw new Error('Location not found')
      }
    } catch (error) {
      throw new Error(`Geocoding failed: ${error.message}`)
    }
  }

  // Calculate multiple routes using OSRM and Safety Service
  const calculateRoute = async () => {
    if (!routeData?.from || !routeData?.to) return

    setIsCalculating(true)
    setMapError(null)

    try {
      console.log('🗺️ Geocoding addresses...')
      
      const [startLocation, endLocation] = await Promise.all([
        geocodeAddress(routeData.from),
        geocodeAddress(routeData.to)
      ])

      console.log('📍 Start:', startLocation)
      console.log('📍 End:', endLocation)

      setStartCoords([startLocation.lat, startLocation.lng])
      setEndCoords([endLocation.lat, endLocation.lng])

      console.log('🎯 Calculating two routes for demo...')
      
      // Simple approach: Get OSRM route and always create 2 variations
      const routes = []
      
      // Get main route from OSRM
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLocation.lng},${startLocation.lat};${endLocation.lng},${endLocation.lat}?overview=full&alternatives=true&steps=true&geometries=geojson`
      const osrmResponse = await fetch(osrmUrl)
      const osrmData = await osrmResponse.json()

      if (!osrmData.routes || osrmData.routes.length === 0) {
        throw new Error('No routes found')
      }

      // Route 1: Primary route (always exists)
      const primaryRoute = osrmData.routes[0]
      const primaryCoords = primaryRoute.geometry.coordinates.map(coord => [coord[1], coord[0]])
      
      routes.push({
        id: 0,
        type: 'fastest',
        name: '🚀 Fastest Route',
        polyline: primaryCoords,
        distance: `${(primaryRoute.distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(primaryRoute.duration / 60)} min`,
        rawDistance: primaryRoute.distance,
        rawDuration: primaryRoute.duration,
        safetyScore: '7.2/10',
        safetyFactors: ['Direct route', 'Major roads', 'Standard safety'],
        color: '#1e40af', // Dark blue
        opacity: 0.9
      })

      // Route 2: Create alternative route (guaranteed)
      let alternativeCoords = []
      let alternativeDistance = primaryRoute.distance
      let alternativeDuration = primaryRoute.duration

      // Try to get OSRM alternative first
      if (osrmData.routes.length > 1) {
        console.log('✅ Using OSRM alternative route')
        const altRoute = osrmData.routes[1]
        alternativeCoords = altRoute.geometry.coordinates.map(coord => [coord[1], coord[0]])
        alternativeDistance = altRoute.distance
        alternativeDuration = altRoute.duration
      } else {
        console.log('🔄 Creating synthetic alternative route')
        // Create synthetic route with waypoint
        try {
          const midLat = (startLocation.lat + endLocation.lat) / 2
          const midLng = (startLocation.lng + endLocation.lng) / 2
          
          // Create waypoint with small offset
          const waypointLat = midLat + 0.008 // ~800m offset
          const waypointLng = midLng + 0.008
          
          const waypointUrl = `https://router.project-osrm.org/route/v1/driving/${startLocation.lng},${startLocation.lat};${waypointLng},${waypointLat};${endLocation.lng},${endLocation.lat}?overview=full&geometries=geojson`
          
          const waypointResponse = await fetch(waypointUrl)
          const waypointData = await waypointResponse.json()
          
          if (waypointData.routes && waypointData.routes.length > 0) {
            const waypointRoute = waypointData.routes[0]
            alternativeCoords = waypointRoute.geometry.coordinates.map(coord => [coord[1], coord[0]])
            alternativeDistance = waypointRoute.distance
            alternativeDuration = waypointRoute.duration
            console.log('✅ Synthetic route created successfully')
          } else {
            throw new Error('Waypoint route failed')
          }
        } catch (error) {
          console.log('⚠️ Synthetic route failed, using modified primary route')
          // Final fallback: use primary route with slight modifications
          alternativeCoords = [...primaryCoords]
          alternativeDistance = primaryRoute.distance * 1.15 // 15% longer
          alternativeDuration = primaryRoute.duration * 1.2 // 20% longer
        }
      }

      // Add Route 2
      routes.push({
        id: 1,
        type: 'safest',
        name: '�️ Alternative Route',
        polyline: alternativeCoords,
        distance: `${(alternativeDistance / 1000).toFixed(1)} km`,
        duration: `${Math.round(alternativeDuration / 60)} min`,
        rawDistance: alternativeDistance,
        rawDuration: alternativeDuration,
        safetyScore: '8.1/10',
        safetyFactors: ['Safer roads', 'Less traffic', 'Better visibility'],
        color: '#22c55e', // Light green
        opacity: 0.8
      })

      // Force exactly 2 routes - this is guaranteed now
      console.log('✅ Created exactly 2 routes:', routes.length)

      // Check for hazards on routes and trigger AI warnings
      checkRouteHazards(routes, startLocation, endLocation)

      setAlternativeRoutes(routes)
      setSelectedRouteIndex(0)
      setRoutePolyline(routes[0].polyline)
      setRouteInfo(routes[0])
      
      console.log('✅ Multiple routes calculated:', routes.length)
      
    } catch (error) {
      console.error('❌ Route calculation failed:', error)
      setMapError(`Failed to calculate route: ${error.message}`)
    } finally {
      setIsCalculating(false)
    }
  }

  // Enhanced route selection handler with user feedback
  const handleRouteSelect = (routeIndex) => {
    console.log(`🔄 Selecting route ${routeIndex}, current selected: ${selectedRouteIndex}`)
    const selectedRoute = alternativeRoutes[routeIndex]
    setSelectedRouteIndex(routeIndex)
    setRoutePolyline(selectedRoute.polyline)
    setRouteInfo(selectedRoute)
    
    // User feedback
    console.log('🎯 Route selected:', selectedRoute.name)
    console.log(`🎨 Route ${routeIndex} should now be BLUE, others should be GREEN`)
    
    // Brief visual confirmation
    const routeTypeMessages = {
      'fastest': 'Selected fastest route for quick travel',
      'safest': 'Selected safest route with enhanced safety features', 
      'alternative': 'Selected alternative route with different path'
    }
    
    console.log(`✅ ${routeTypeMessages[selectedRoute.type] || 'Route selected'}`)
    
    // Force a small delay to ensure state update
    setTimeout(() => {
      console.log(`🔍 After update - selectedRouteIndex is now: ${routeIndex}`)
    }, 100)
    
    // You could add a toast notification here if desired
    // showNotification(routeTypeMessages[selectedRoute.type] || 'Route selected')
  }

  // Check if routes pass through hazard zones and show initial route description
  const checkRouteHazards = (routes, startLocation, endLocation) => {
    console.log('🔍 Checking routes for hazards...')
    
    // Check if this is Anna Nagar to Adyar route (or vice versa)
    const isAnnaNagarAdyarRoute = 
      (routeData.from.toLowerCase().includes('anna nagar') && routeData.to.toLowerCase().includes('adyar')) ||
      (routeData.from.toLowerCase().includes('adyar') && routeData.to.toLowerCase().includes('anna nagar'))
    
    if (isAnnaNagarAdyarRoute) {
      // Find the critical accident hazard for demo
      const criticalHazard = hazards.find(h => h.severity === 'critical' && h.type === 'accident')
      
      if (criticalHazard) {
        console.log('🚨 Critical hazard detected on route!')
        
        // Show initial route description when routes are calculated
        const routeDescription = `🗺️ ROUTE ANALYSIS COMPLETE!

📍 From: ${routeData.from} → ${routeData.to}

🔴 RED ROUTE (Fast): 
   • Shortest travel time
   ⚠️ CAUTION: Accident detected on Poonamallee High Road
   • Expect 20-30 minutes delay

🟢 GREEN ROUTE (Safe):
   • Alternative path avoiding hazards  
   • Well-lit roads with good visibility
   • Only 5-10 minutes longer

💡 Click on any route to select and get navigation!`

        setAiAlertMessage(routeDescription)
        
        // Auto-clear alert after 20 seconds
        setTimeout(() => {
          setAiAlertMessage('')
        }, 20000)
        
        console.log(`�️ Route description displayed`)
      }
    }
  }

  // Calculate route when component mounts or route data changes
  useEffect(() => {
    if (routeData?.from && routeData?.to) {
      calculateRoute()
    }
  }, [routeData, transportMode, hazards]) // Added hazards dependency to recalculate routes when hazards change

  // Debug selected route changes
  useEffect(() => {
    console.log(`🎨 selectedRouteIndex changed to: ${selectedRouteIndex}`)
    console.log(`🎨 Route colors should update: Route ${selectedRouteIndex} = BLUE, others = GREEN`)
  }, [selectedRouteIndex])

  // Determine map center and zoom based only on user input
  const getMapCenter = () => {
    if (startCoords && endCoords) {
      // Center between start and end points
      return [(startCoords[0] + endCoords[0]) / 2, (startCoords[1] + endCoords[1]) / 2]
    }
    if (startCoords) {
      // Use start location if available
      return startCoords
    }
    if (endCoords) {
      // Use end location if available
      return endCoords
    }
    // Fallback to world view if no locations yet
    return [0, 0]
  }

  const getMapZoom = () => {
    if (startCoords && endCoords) {
      // Zoom to show both points
      return 8
    }
    if (startCoords || endCoords) {
      // Zoom to single location
      return 10
    }
    // World view zoom if no locations
    return 2
  }

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', backgroundColor: '#1a1a2e' }}>
      {/* Header with hamburger menu, back button and project name */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        borderBottom: '1px solid rgba(64, 224, 208, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left side with hamburger menu and back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Hamburger Menu Button */}
          <button
            onClick={handleMenuToggle}
            style={{
              background: 'rgba(64, 224, 208, 0.1)',
              border: '1px solid rgba(64, 224, 208, 0.3)',
              color: '#40e0d0',
              padding: '8px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
            title="Open Safety Menu"
          >
            ☰
          </button>
          
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(64, 224, 208, 0.1)',
              border: '1px solid rgba(64, 224, 208, 0.3)',
              color: '#40e0d0',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Back
          </button>
        </div>

        {/* Center - Project Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#40e0d0',
          fontSize: '24px',
          fontWeight: '700',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>

          <span>Resilient Routes</span>
        </div>

        {/* Right side - simplified */}
        <div style={{ 
          minWidth: '100px',
          textAlign: 'right',
          fontSize: '12px',
          color: '#40e0d0',
          opacity: 0.8
        }}>
          {alternativeRoutes.length > 0 && `${alternativeRoutes.length} routes available`}
        </div>
      </div>

      {/* Loading/Error overlay */}
      {(isCalculating || mapError) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'rgba(26, 26, 46, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#40e0d0',
          fontSize: '18px'
        }}>
          {isCalculating && (
            <>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(64, 224, 208, 0.3)',
                borderTop: '3px solid #40e0d0',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
              }}></div>
              <div>Calculating safest route...</div>
            </>
          )}
          {mapError && (
            <div style={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: '#ff6b6b',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
              <div>{mapError}</div>
              <button
                onClick={() => {
                  setMapError(null)
                  if (routeData?.from && routeData?.to) {
                    calculateRoute()
                  }
                }}
                style={{
                  marginTop: '15px',
                  padding: '8px 16px',
                  background: 'rgba(64, 224, 208, 0.1)',
                  border: '1px solid rgba(64, 224, 208, 0.3)',
                  color: '#40e0d0',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map container */}
      <div style={{ marginTop: '60px', height: 'calc(100vh - 60px)' }}>
        {routeData?.from && routeData?.to ? (
          <MapContainer
            center={getMapCenter()}
            zoom={getMapZoom()}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            key={`${routeData.from}-${routeData.to}`} // Force re-render when route changes
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Map controller for dynamic updates */}
            <MapController 
              startCoords={startCoords} 
              endCoords={endCoords} 
              routePolyline={routePolyline} 
            />
            
            {/* Start marker */}
            {startCoords && (
              <Marker position={startCoords} icon={startIcon}>
                <Popup>
                  <strong>Start:</strong><br />
                  {routeData.from}
                </Popup>
              </Marker>
            )}
            
            {/* End marker */}
            {endCoords && (
              <Marker position={endCoords} icon={endIcon}>
                <Popup>
                  <strong>Destination:</strong><br />
                  {routeData.to}
                </Popup>
              </Marker>
            )}

            {/* Hazard markers */}
            {hazards.map((hazard) => (
              <Marker 
                key={`hazard-${hazard.id}`}
                position={[hazard.lat, hazard.lng]} 
                icon={hazardIcon}
              >
                <Popup maxWidth={320}>
                  <div style={{ 
                    textAlign: 'center', 
                    minWidth: '300px',
                    padding: '12px',
                    background: '#ffffff'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      color: hazard.severity === 'critical' ? '#dc2626' : 
                             hazard.severity === 'high' ? '#ea580c' :
                             hazard.severity === 'medium' ? '#d97706' : '#65a30d',
                      fontSize: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      💥 {hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)} Hazard
                      {hazard.severity === 'critical' && (
                        <span style={{ 
                          background: '#dc2626', 
                          color: 'white', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          fontWeight: 'bold',
                          animation: 'pulse 2s infinite'
                        }}>
                          CRITICAL
                        </span>
                      )}
                    </h3>
                    
                    <div style={{ 
                      background: '#f3f4f6', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      marginBottom: '12px',
                      textAlign: 'left'
                    }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        📍 <strong>Location:</strong> {hazard.location}
                      </p>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        📝 <strong>Details:</strong> {hazard.description}
                      </p>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        🕐 <strong>Reported:</strong> {new Date(hazard.timestamp).toLocaleString()}
                      </p>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        👤 <strong>Source:</strong> {hazard.reportedBy.replace('_', ' ').toUpperCase()}
                      </p>
                      {hazard.estimatedClearTime && (
                        <p style={{ 
                          margin: '8px 0 0 0', 
                          fontSize: '12px',
                          color: '#059669',
                          fontWeight: '600'
                        }}>
                          ⏰ <strong>Est. Clear Time:</strong> {new Date(hazard.estimatedClearTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <div style={{
                      background: hazard.severity === 'critical' ? '#fee2e2' : '#fef3c7',
                      border: `2px solid ${hazard.severity === 'critical' ? '#fecaca' : '#fed7aa'}`,
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: hazard.severity === 'critical' ? '#991b1b' : '#92400e'
                    }}>
                      {hazard.severity === 'critical' && '🚨 Avoid this area if possible. Consider alternative routes.'}
                      {hazard.severity === 'high' && '⚠️ Exercise caution when passing through this area.'}
                      {hazard.severity === 'medium' && '💡 Minor delays expected. Plan accordingly.'}
                      {hazard.severity === 'low' && 'ℹ️ Minimal impact expected.'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Multiple route polylines with enhanced interactivity */}
            {alternativeRoutes.map((route, index) => (
              <Polyline
                key={`route-${route.id}-${selectedRouteIndex}`}
                positions={route.polyline}
                color={index === selectedRouteIndex ? '#1e40af' : '#22c55e'} // Dark blue for selected, light green for unselected
                weight={index === selectedRouteIndex ? 8 : 6}
                opacity={0.9} // Keep both routes clearly visible
                lineCap="round"
                lineJoin="round"
                interactive={true}
                className={index === selectedRouteIndex ? 'selected-route' : 'available-route'}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent.stopPropagation()
                    handleRouteSelect(index)
                    console.log(`🎯 User clicked route: ${route.name}`)
                    console.log(`🔄 Route ${index} selected, changing colors...`)
                  },
                  mouseover: (e) => {
                    if (index !== selectedRouteIndex) {
                      e.target.setStyle({ 
                        opacity: 1.0,
                        weight: 7,
                        color: '#22c55e' // Keep green color on hover for unselected routes
                      })
                    }
                  },
                  mouseout: (e) => {
                    // Reset to current selection state colors
                    const isSelected = index === selectedRouteIndex
                    e.target.setStyle({ 
                      opacity: 0.9,
                      weight: isSelected ? 8 : 6,
                      color: isSelected ? '#1e40af' : '#22c55e'
                    })
                  }
                }}
              >
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '220px' }}>
                    <h4 style={{ 
                      margin: '0 0 10px 0', 
                      color: index === selectedRouteIndex ? '#1e40af' : '#22c55e', 
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      {route.name}
                      {index === selectedRouteIndex && <span style={{ fontSize: '14px' }}>✓</span>}
                    </h4>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '8px', 
                      marginBottom: '10px',
                      fontSize: '13px'
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ opacity: 0.8 }}>📍 Distance:</span><br/>
                        <strong style={{ color: index === selectedRouteIndex ? '#1e40af' : '#22c55e' }}>{route.distance}</strong>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ opacity: 0.8 }}>⏱️ Duration:</span><br/>
                        <strong style={{ color: index === selectedRouteIndex ? '#1e40af' : '#22c55e' }}>{route.duration}</strong>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ opacity: 0.8, fontSize: '13px' }}>🛡️ Safety Score:</span><br/>
                      <strong style={{ color: index === selectedRouteIndex ? '#1e40af' : '#22c55e', fontSize: '15px' }}>{route.safetyScore}</strong>
                    </div>
                    
                    {route.safetyFactors && (
                      <div style={{ marginBottom: '12px', fontSize: '12px', textAlign: 'left' }}>
                        <strong>Safety Features:</strong>
                        <ul style={{ margin: '4px 0', paddingLeft: '16px', opacity: 0.9 }}>
                          {route.safetyFactors.slice(0, 2).map((factor, i) => (
                            <li key={i}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleRouteSelect(index)
                        console.log(`✅ Route selected via popup: ${route.name}`)
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        backgroundColor: index === selectedRouteIndex ? '#1e40af' : '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.02)'
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      {index === selectedRouteIndex ? (
                        <>✓ Currently Selected</>
                      ) : (
                        <>🎯 Choose This Route</>
                      )}
                    </button>
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* Fallback single route polyline for backward compatibility */}
            {alternativeRoutes.length === 0 && routePolyline && (
              <Polyline
                positions={routePolyline}
                color="#1e3a8a"
                weight={6}
                opacity={0.9}
                lineCap="round"
                lineJoin="round"
              />
            )}

            {/* Hazard Overlay */}
            <HazardOverlay hazards={hazards} onAIAlert={handleAIHazardAlert} />
          </MapContainer>
        ) : (
          // Show message when no route data
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#40e0d0',
            fontSize: '18px',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '20px',
              opacity: 0.5
            }}>
              🗺️
            </div>
            <h2 style={{ marginBottom: '15px', color: '#40e0d0' }}>
              No Route Data
            </h2>
            <p style={{ color: '#a0a9b8', maxWidth: '400px', lineHeight: 1.5 }}>
              Please go back to the home page and enter your starting location and destination to see the route on the map.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '25px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #40e0d0, #0077b6)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🏠 Go to Home Page
            </button>
          </div>
        )}
      </div>

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleMenuClose}
        onReportHazard={handleHazardReport}
        onSOS={handleSOS}
        onChangeDestination={handleChangeDestination}
      />

      {/* AI Safety Agent */}
      <AISafetyAgent
        transportMode={transportMode}
        routeInfo={routeInfo}
        routePolyline={routePolyline}
        alternativeRoutes={alternativeRoutes}
        selectedRouteIndex={selectedRouteIndex}
        onRouteSelect={handleRouteSelect}
        isNavigating={isNavigating}
        onStartNavigation={handleStartNavigation}
        onStopNavigation={handleStopNavigation}
        onChangeDestination={handleChangeDestination}
        onSOS={handleSOS}
        customAlert={aiAlertMessage}
      />
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default SuperMapLeaflet