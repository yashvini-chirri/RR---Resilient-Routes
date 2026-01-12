import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const SuperMap = ({ routeData, transportMode }) => {
  const [routeInfo, setRouteInfo] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [mapError, setMapError] = useState(null)
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [routePolyline, setRoutePolyline] = useState(null)
  const navigate = useNavigate()

  // Default center (Delhi, India)
  const defaultCenter = [28.6139, 77.2090]

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

  // Calculate route using OSRM (Open Source Routing Machine)
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

      // Calculate route using OSRM
      const routingProfile = getRoutingProfile(transportMode)
      const routeUrl = `https://router.project-osrm.org/route/v1/${routingProfile}/${startLocation.lng},${startLocation.lat};${endLocation.lng},${endLocation.lat}?overview=full&geometries=geojson`

      console.log('🛣️ Calculating route...')
      const routeResponse = await fetch(routeUrl)
      const routeData = await routeResponse.json()

      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0]
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]) // Leaflet uses [lat, lng]
        
        setRoutePolyline(coordinates)
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1) + ' km',
          duration: Math.round(route.duration / 60) + ' min',
          startAddress: routeData.from,
          endAddress: routeData.to
        })

        console.log('✅ Route calculated successfully')
        setMapError(null)
      } else {
        throw new Error('No route found')
      }
    } catch (error) {
      console.error('❌ Route calculation error:', error)
      setMapError(`Route calculation failed: ${error.message}`)
      setRouteInfo(null)
    } finally {
      setIsCalculating(false)
    }
  }

  const getRoutingProfile = (mode) => {
    switch (mode) {
      case 'walking':
        return 'foot'
      case 'bicycle':
        return 'bike'
      case 'car':
      case 'bike':
      default:
        return 'driving'
    }
  }

  // Calculate route when component mounts or route data changes
  useEffect(() => {
    if (routeData?.from && routeData?.to) {
      calculateRoute()
    }
  }, [routeData, transportMode])

  const calculateRoute = async () => {
    if (!directionsService.current || !directionsRenderer.current || !routeData) {
      console.warn('⚠️ Missing required services or route data')
      return
    }

    setIsCalculating(true)
    setMapError(null)
    
    console.log('📍 Calculating route:', {
      from: routeData.from,
      to: routeData.to,
      mode: transportMode
    })

    const request = {
      origin: routeData.from,
      destination: routeData.to,
      travelMode: getTravelMode(transportMode),
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }

    directionsService.current.route(request, (result, status) => {
      setIsCalculating(false)
      
      console.log('🛣️ Directions API response:', { status, result })
      
      if (status === 'OK' && result) {
        console.log('✅ Route calculated successfully')
        
        try {
          // Display the route
          directionsRenderer.current.setDirections(result)
          
          // Extract route information
          const route = result.routes[0]
          const leg = route.legs[0]
          
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
            startAddress: leg.start_address,
            endAddress: leg.end_address
          })
          
          // Fit map to show entire route
          if (mapInstance.current) {
            const bounds = new window.google.maps.LatLngBounds()
            route.legs.forEach(leg => {
              bounds.extend(leg.start_location)
              bounds.extend(leg.end_location)
            })
            mapInstance.current.fitBounds(bounds)
          }
          
          setMapError(null)
        } catch (error) {
          console.error('❌ Error processing route result:', error)
          setMapError('Error processing route: ' + error.message)
        }
      } else {
        const errorMessage = `Route calculation failed: ${status}`
        console.error('❌', errorMessage)
        setMapError(errorMessage + '. Please check your locations and try again.')
        setRouteInfo(null)
      }
    })
  }

  const getTravelMode = (mode) => {
    const modes = {
      'walking': window.google.maps.TravelMode.WALKING,
      'bicycle': window.google.maps.TravelMode.BICYCLING,
      'bike': window.google.maps.TravelMode.DRIVING,
      'car': window.google.maps.TravelMode.DRIVING,
      'transit': window.google.maps.TravelMode.TRANSIT
    }
    return modes[mode] || window.google.maps.TravelMode.DRIVING
  }

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', backgroundColor: '#1a1a2e' }}>
      {/* Header with back button and route info */}
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
        
        {routeInfo && (
          <div style={{
            display: 'flex',
            gap: '20px',
            color: '#40e0d0',
            fontSize: '14px'
          }}>
            <span>📍 {routeInfo.distance}</span>
            <span>⏱️ {routeInfo.duration}</span>
          </div>
        )}
      </div>

      {/* Loading/Error overlay */}
      {(!mapLoaded || isCalculating || mapError) && (
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
          {!mapLoaded && (
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
              <div>Loading Google Maps...</div>
            </>
          )}
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
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default SuperMap
