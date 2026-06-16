import { chennaiSafetyData, calculateRoadSafety } from '../data/chennaiSafetyData.js'

export class SafetyRoutingService {
  constructor() {
    this.osrmBaseUrl = 'https://router.project-osrm.org/route/v1'
  }

  async calculateSafeRoute(startCoords, endCoords, transportMode, options = {}) {
    console.log('🛡️ Calculating safety-optimized route for Chennai...')
    
    try {
      // Get multiple route alternatives from OSRM
      const routes = await this.getOSRMAlternatives(startCoords, endCoords, transportMode)
      
      if (!routes || routes.length === 0) {
        throw new Error('No routes found from OSRM service')
      }

      // Apply Chennai safety scoring to each route
      const safetyAnalyzedRoutes = await this.analyzeSafetyForRoutes(routes, transportMode, options)
      
      // Select the safest route
      const safestRoute = this.selectSafestRoute(safetyAnalyzedRoutes, transportMode)
      
      console.log('✅ Safety analysis complete. Selected safest route with score:', safestRoute.safetyScore)
      
      return {
        route: safestRoute.osrmRoute,
        safetyScore: safestRoute.safetyScore,
        safetyFactors: safestRoute.safetyFactors,
        alternativeCount: routes.length,
        routeType: 'Chennai Safety-Optimized'
      }
      
    } catch (error) {
      console.error('❌ Safety routing error:', error)
      throw error
    }
  }

  async getOSRMAlternatives(startCoords, endCoords, transportMode) {
    const profile = this.getOSRMProfile(transportMode)
    
    // Request multiple alternatives for safety analysis
    const osrmUrl = `${this.osrmBaseUrl}/${profile}/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson&alternatives=true&alternative_count=5&steps=true`
    
    console.log('🔗 OSRM Safety Request:', osrmUrl)
    
    const response = await fetch(osrmUrl)
    const data = await response.json()
    
    if (!data.routes || data.routes.length === 0) {
      // Fallback: try without alternatives
      const fallbackUrl = `${this.osrmBaseUrl}/${profile}/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson&steps=true`
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackData = await fallbackResponse.json()
      return fallbackData.routes || []
    }
    
    return data.routes
  }

  async analyzeSafetyForRoutes(routes, transportMode, options = {}) {
    const currentTime = new Date()
    const weather = options.weather || 'clear'
    
    console.log(`🔍 Analyzing ${routes.length} routes for safety factors...`)
    
    const analyzedRoutes = []
    
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const coordinates = route.geometry.coordinates
      
      // Convert coordinates to [lat, lng] format for safety analysis
      const latLngCoords = coordinates.map(coord => [coord[1], coord[0]])
      
      // Calculate comprehensive safety score
      const safetyAnalysis = this.performDetailedSafetyAnalysis(
        latLngCoords, 
        transportMode, 
        currentTime, 
        weather,
        route
      )
      
      analyzedRoutes.push({
        osrmRoute: route,
        safetyScore: safetyAnalysis.totalScore,
        safetyFactors: safetyAnalysis.factors,
        riskZones: safetyAnalysis.riskZones
      })
    }
    
    return analyzedRoutes
  }

  performDetailedSafetyAnalysis(coordinates, transportMode, currentTime, weather, route) {
    let totalScore = 7 // Start with good base score
    const factors = []
    const riskZones = []
    
    // 1. Road width compatibility analysis - CRITICAL for cars and bikes
    const widthCompatibility = this.analyzeRoadWidthCompatibility(coordinates, transportMode)
    totalScore += widthCompatibility.score
    if (widthCompatibility.score !== 0) {
      factors.push(`Road width compatibility: ${widthCompatibility.score > 0 ? '+' : ''}${widthCompatibility.score.toFixed(1)} - ${widthCompatibility.reason}`)
    }
    
    // 2. Check for high-risk zones along the route
    let riskZonesPenalty = 0
    chennaiSafetyData.highRiskZones.forEach(zone => {
      const nearbyPoints = coordinates.filter(coord => {
        const distance = this.calculateDistance(coord, zone.coordinates)
        return distance < zone.radius
      })
      
      if (nearbyPoints.length > 0) {
        const penalty = this.getRiskZonePenalty(zone.riskLevel)
        riskZonesPenalty += penalty
        riskZones.push({
          name: zone.name,
          riskLevel: zone.riskLevel,
          penalty: penalty
        })
      }
    })
    
    totalScore -= riskZonesPenalty
    if (riskZonesPenalty > 0) {
      factors.push(`Risk zones penalty: -${riskZonesPenalty.toFixed(1)}`)
    }

    // 3. Apply time-based safety factors
    const timeSlot = this.getCurrentTimeSlot(currentTime)
    const timeFactor = chennaiSafetyData.timeSafetyFactors[timeSlot]
    if (timeFactor) {
      const timeBonus = (timeFactor.multiplier - 1) * 2 // Scale for visibility
      totalScore += timeBonus
      factors.push(`Time factor (${timeSlot}): ${timeBonus > 0 ? '+' : ''}${timeBonus.toFixed(1)} - ${timeFactor.reason}`)
    }

    // 4. Apply weather safety factors
    const weatherFactor = chennaiSafetyData.weatherSafetyFactors[weather]
    if (weatherFactor && weatherFactor !== 1.0) {
      const weatherBonus = (weatherFactor - 1) * 3
      totalScore += weatherBonus
      factors.push(`Weather (${weather}): ${weatherBonus > 0 ? '+' : ''}${weatherBonus.toFixed(1)}`)
    }

    // 5. Transport mode specific adjustments
    const transportData = chennaiSafetyData.transportSafety[transportMode]
    if (transportData) {
      const modeBonus = (transportData.safetyMultiplier - 0.8) * 2
      totalScore += modeBonus
      factors.push(`Transport mode (${transportMode}): ${modeBonus > 0 ? '+' : ''}${modeBonus.toFixed(1)}`)
    }

    // 6. Route length penalty for longer routes (safety decreases with distance)
    const distanceKm = route.distance / 1000
    if (distanceKm > 10) {
      const distancePenalty = Math.min(2, (distanceKm - 10) * 0.1)
      totalScore -= distancePenalty
      factors.push(`Long route penalty: -${distancePenalty.toFixed(1)}`)
    }

    // 7. Speed-based safety assessment
    const avgSpeed = (route.distance / route.duration) * 3.6 // km/h
    const speedLimits = { car: 60, bike: 60, bicycle: 25, walking: 5 }
    const expectedSpeed = speedLimits[transportMode] || 50
    
    if (avgSpeed > expectedSpeed * 1.2) {
      const speedPenalty = 1.5
      totalScore -= speedPenalty
      factors.push(`High speed route penalty: -${speedPenalty}`)
    }

    // 8. Chennai-specific road bonus
    if (this.routeUsesMainArterials(coordinates)) {
      const arterialBonus = 1.5
      totalScore += arterialBonus
      factors.push(`Major arterial roads bonus: +${arterialBonus}`)
    }

    // Clamp score between 1 and 10
    totalScore = Math.max(1, Math.min(10, totalScore))
    
    return {
      totalScore,
      factors,
      riskZones
    }
  }

  // NEW: Analyze road width compatibility for transport mode
  analyzeRoadWidthCompatibility(coordinates, transportMode) {
    const transportData = chennaiSafetyData.transportSafety[transportMode]
    if (!transportData) return { score: 0, reason: "Unknown transport mode" }
    
    let compatiblePoints = 0
    let incompatiblePoints = 0
    let wideRoadBonus = 0
    let totalRoadsChecked = 0
    
    // Check each coordinate against known Chennai roads
    coordinates.forEach(coord => {
      Object.entries(chennaiSafetyData.roads).forEach(([roadName, road]) => {
        if (this.isPointNearRoad(coord, road.coordinates, 300)) { // 300m tolerance
          totalRoadsChecked++
          
          // Check vehicle compatibility
          if (road.vehicleCompatibility && road.vehicleCompatibility.includes(transportMode)) {
            compatiblePoints++
            
            // Bonus for wide roads
            if (road.widthMeters >= transportData.widthBonusThreshold) {
              wideRoadBonus += 0.5
            }
          } else {
            incompatiblePoints++
          }
        }
      })
    })
    
    if (totalRoadsChecked === 0) {
      // No specific road data available - use generic assessment
      return this.getGenericWidthAssessment(transportMode)
    }
    
    const compatibilityRatio = compatiblePoints / (compatiblePoints + incompatiblePoints)
    let score = 0
    let reason = ""
    
    // Calculate score based on compatibility
    if (transportMode === 'car' || transportMode === 'bike') {
      if (compatibilityRatio >= 0.8) {
        score = 2 + (wideRoadBonus * 0.5)
        reason = `Excellent road width compatibility (${(compatibilityRatio * 100).toFixed(0)}% suitable roads)`
      } else if (compatibilityRatio >= 0.6) {
        score = 1
        reason = `Good road width compatibility (${(compatibilityRatio * 100).toFixed(0)}% suitable roads)`
      } else if (compatibilityRatio >= 0.4) {
        score = -1
        reason = `Fair road width compatibility (${(compatibilityRatio * 100).toFixed(0)}% suitable roads)`
      } else {
        score = -3
        reason = `Poor road width compatibility (${(compatibilityRatio * 100).toFixed(0)}% suitable roads) - Too many narrow roads`
      }
    } else {
      // Bicycles and walking are more flexible with road width
      score = Math.min(1, compatibilityRatio * 2)
      reason = `Flexible transport mode - good road compatibility`
    }
    
    return { score, reason }
  }

  // Generic width assessment when no specific road data
  getGenericWidthAssessment(transportMode) {
    switch(transportMode) {
      case 'car':
        return { 
          score: -0.5, 
          reason: "Cars may face challenges on narrow Chennai roads" 
        }
      case 'bike':
        return { 
          score: 0.5, 
          reason: "Motorcycles generally navigate Chennai roads well" 
        }
      case 'bicycle':
        return { 
          score: 1, 
          reason: "Bicycles adaptable to various road widths" 
        }
      case 'walking':
        return { 
          score: 1.5, 
          reason: "Pedestrians most flexible with road conditions" 
        }
      default:
        return { score: 0, reason: "Standard road compatibility" }
    }
  }

  selectSafestRoute(analyzedRoutes, transportMode) {
    // Sort by safety score (highest first)
    const sortedRoutes = analyzedRoutes.sort((a, b) => b.safetyScore - a.safetyScore)
    
    console.log('📊 Route safety rankings:')
    sortedRoutes.forEach((route, index) => {
      const duration = Math.round(route.osrmRoute.duration / 60)
      const distance = (route.osrmRoute.distance / 1000).toFixed(1)
      console.log(`  ${index + 1}. Safety: ${route.safetyScore.toFixed(1)}/10 | ${distance}km, ${duration}min`)
    })
    
    return sortedRoutes[0] // Return the safest route
  }

  // Helper methods
  getRiskZonePenalty(riskLevel) {
    const penalties = {
      'very-high': 2.5,
      'high': 1.5,
      'medium-high': 1.0,
      'medium': 0.5
    }
    return penalties[riskLevel] || 0
  }

  getCurrentTimeSlot(currentTime = new Date()) {
    const hour = currentTime.getHours()
    if (hour >= 6 && hour < 10) return "06:00-10:00"
    if (hour >= 10 && hour < 16) return "10:00-16:00"
    if (hour >= 16 && hour < 21) return "16:00-21:00"
    return "21:00-06:00"
  }

  calculateDistance(coord1, coord2) {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = coord1[0] * Math.PI/180
    const φ2 = coord2[0] * Math.PI/180
    const Δφ = (coord2[0]-coord1[0]) * Math.PI/180
    const Δλ = (coord2[1]-coord1[1]) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  routeUsesMainArterials(coordinates) {
    // Check if route uses major Chennai arterial roads
    const mainRoads = [
      { name: "Anna Salai", bounds: [[13.0827, 80.2707], [13.0527, 80.2507]] },
      { name: "OMR", bounds: [[12.9716, 80.2463], [12.8270, 80.2234]] },
      { name: "ECR", bounds: [[13.0067, 80.2833], [12.7833, 80.2167]] }
    ]
    
    let arterialPoints = 0
    coordinates.forEach(coord => {
      mainRoads.forEach(road => {
        if (this.isPointNearRoad(coord, road.bounds, 200)) { // 200m tolerance
          arterialPoints++
        }
      })
    })
    
    // If more than 30% of route uses arterial roads
    return (arterialPoints / coordinates.length) > 0.3
  }

  isPointNearRoad(point, roadBounds, tolerance) {
    // Simplified check - in real implementation, use more sophisticated road matching
    const [lat, lng] = point
    const [[lat1, lng1], [lat2, lng2]] = roadBounds
    
    return lat >= Math.min(lat1, lat2) - tolerance/111000 && 
           lat <= Math.max(lat1, lat2) + tolerance/111000 &&
           lng >= Math.min(lng1, lng2) - tolerance/111000 && 
           lng <= Math.max(lng1, lng2) + tolerance/111000
  }

  getOSRMProfile(transportMode) {
    const profiles = {
      'car': 'driving',
      'bike': 'driving', // Motorcycles use driving profile
      'bicycle': 'cycling',
      'walking': 'foot'
    }
    return profiles[transportMode] || 'driving'
  }
}

export default SafetyRoutingService