# API Documentation - Resilient Routes

## 1. External API Integrations

### 1.1 OSRM Routing API

#### Base URL
```
https://router.project-osrm.org/route/v1/
```

#### Route Calculation Endpoint
```http
GET /route/v1/{profile}/{coordinates}?{parameters}
```

**Parameters:**
- `profile`: Transportation mode (`driving`, `cycling`, `foot`)
- `coordinates`: Comma-separated longitude,latitude pairs
- `alternatives`: `true` to get alternative routes
- `geometries`: `polyline` for encoded geometry
- `overview`: `full` for complete route geometry
- `steps`: `true` for turn-by-turn directions

**Example Request:**
```javascript
const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?alternatives=true&geometries=polyline&overview=full`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    // Process route data
    console.log(data.routes);
  });
```

**Response Format:**
```json
{
  "code": "Ok",
  "routes": [
    {
      "geometry": "encoded_polyline_string",
      "legs": [
        {
          "steps": [],
          "summary": "",
          "weight": 1234.5,
          "duration": 1800.0,
          "distance": 15000.0
        }
      ],
      "weight_name": "routability",
      "weight": 1234.5,
      "duration": 1800.0,
      "distance": 15000.0
    }
  ],
  "waypoints": [
    {
      "hint": "hint_string",
      "distance": 0.0,
      "name": "Street Name",
      "location": [80.2707, 13.0827]
    }
  ]
}
```

#### Error Handling
```javascript
const handleOSRMError = (error, data) => {
  if (data?.code === 'NoRoute') {
    return 'No route found between the locations';
  } else if (data?.code === 'InvalidInput') {
    return 'Invalid coordinates provided';
  } else {
    return 'Route calculation failed. Please try again.';
  }
};
```

### 1.2 Nominatim Geocoding API

#### Base URL
```
https://nominatim.openstreetmap.org/
```

#### Geocoding Endpoint
```http
GET /search?{parameters}
```

**Parameters:**
- `q`: Search query (address or place name)
- `format`: Response format (`json`)
- `limit`: Maximum number of results (default: 10)
- `countrycodes`: Country filter (`IN` for India)
- `addressdetails`: Include address breakdown (`1`)
- `bounded`: Restrict to viewbox (`1`)
- `viewbox`: Bounding box for results

**Example Request:**
```javascript
const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=5&countrycodes=IN&addressdetails=1`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return [];
  }
};
```

**Response Format:**
```json
[
  {
    "place_id": 123456,
    "licence": "Data © OpenStreetMap contributors",
    "osm_type": "way",
    "osm_id": 789012,
    "boundingbox": ["13.0800", "13.0900", "80.2600", "80.2700"],
    "lat": "13.0827",
    "lon": "80.2707",
    "display_name": "Anna Nagar, Chennai, Tamil Nadu, India",
    "class": "place",
    "type": "suburb",
    "importance": 0.5,
    "address": {
      "suburb": "Anna Nagar",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "postcode": "600040"
    }
  }
]
```

#### Rate Limiting
```javascript
// Nominatim rate limiting: 1 request per second
const rateLimitedGeocode = (() => {
  let lastCall = 0;
  return async (address) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    if (timeSinceLastCall < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastCall));
    }
    lastCall = Date.now();
    return geocodeAddress(address);
  };
})();
```

### 1.3 OpenStreetMap Tile API

#### Tile URL Template
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

**Parameters:**
- `{s}`: Subdomain (`a`, `b`, or `c`)
- `{z}`: Zoom level (0-18)
- `{x}`: Tile X coordinate
- `{y}`: Tile Y coordinate

**Leaflet Integration:**
```javascript
import { TileLayer } from 'react-leaflet';

<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  maxZoom={18}
/>
```

**Usage Policy:**
- Maximum 2 concurrent connections
- Include proper attribution
- Respect tile usage limits
- Cache tiles appropriately

## 2. Internal API Services

### 2.1 SafetyRoutingService

#### calculateRoute Method
```javascript
const calculateRoute = async (startCoords, endCoords, transportMode) => {
  const [startLat, startLng] = startCoords;
  const [endLat, endLng] = endCoords;
  
  const profile = transportMode === 'car' ? 'driving' : 
                 transportMode === 'bike' ? 'cycling' : 'foot';
  
  const url = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?alternatives=true&geometries=polyline&overview=full`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok') {
      return {
        success: true,
        routes: data.routes.map((route, index) => ({
          ...route,
          name: index === 0 ? 'fastest' : 'alternative',
          type: index === 0 ? 'fastest' : 'safest',
          polyline: route.geometry
        }))
      };
    } else {
      throw new Error(data.message || 'Route calculation failed');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

#### geocodeLocation Method
```javascript
const geocodeLocation = async (address) => {
  if (!address?.trim()) {
    throw new Error('Address is required');
  }
  
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=5&countrycodes=IN&addressdetails=1`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.length > 0) {
      const location = data[0];
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
        display_name: location.display_name,
        address: location.address
      };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};
```

### 2.2 Chennai Safety Data API

#### Data Structure
```javascript
export const chennaiSafetyData = {
  // High-risk roads with safety ratings
  roads: [
    {
      name: "Poonamallee High Road",
      coordinates: [[13.0569, 80.2091], [13.0827, 80.2707]],
      safetyRating: 3,
      averageSpeed: 45,
      lightingQuality: "fair",
      accidents: 12,
      crimeRate: "medium"
    }
    // ... more roads
  ],
  
  // Active hazards
  hazards: [
    {
      id: "hazard_001",
      type: "accident",
      severity: "critical",
      location: [13.0698, 80.2399],
      description: "Multi-vehicle accident blocking two lanes",
      expectedDuration: "2-3 hours",
      reportedAt: "2024-01-15T10:30:00Z"
    }
    // ... more hazards
  ],
  
  // Safe zones and facilities
  safeZones: [
    {
      name: "Government General Hospital",
      bounds: [[13.0813, 80.2691], [13.0833, 80.2711]],
      type: "hospital",
      facilities: ["Emergency Care", "Trauma Center", "24/7 Service"],
      emergencyContacts: ["+91-44-2819-3040"]
    }
    // ... more safe zones
  ]
};
```

#### Data Access Methods
```javascript
// Get roads by safety rating
const getRoadsBySafety = (minRating) => {
  return chennaiSafetyData.roads.filter(road => road.safetyRating >= minRating);
};

// Get active hazards by severity
const getHazardsBySeverity = (severity) => {
  return chennaiSafetyData.hazards.filter(hazard => hazard.severity === severity);
};

// Get nearby safe zones
const getNearbyFacilities = (lat, lng, radius = 0.01) => {
  return chennaiSafetyData.safeZones.filter(zone => {
    const [zoneLat, zoneLng] = zone.bounds[0];
    const distance = Math.sqrt(Math.pow(lat - zoneLat, 2) + Math.pow(lng - zoneLng, 2));
    return distance <= radius;
  });
};
```

## 3. Error Handling & Status Codes

### 3.1 Common Error Responses

#### OSRM API Errors
```javascript
const OSRM_ERRORS = {
  'Ok': 'Request successful',
  'NoRoute': 'No route found between coordinates',
  'NoSegment': 'One of the supplied input coordinates could not snap to street segment',
  'NoMatch': 'Could not match the input to the road network',
  'InvalidInput': 'Input coordinates are invalid',
  'InvalidOptions': 'Invalid options provided',
  'InvalidQuery': 'Invalid query parameters'
};
```

#### Nominatim API Errors
```javascript
const handleGeocodingError = (error, response) => {
  if (!response.ok) {
    switch (response.status) {
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 403:
        return 'Access forbidden. Check API usage policy.';
      case 500:
        return 'Geocoding service temporarily unavailable.';
      default:
        return 'Address lookup failed. Please check your input.';
    }
  }
  return error.message;
};
```

### 3.2 Network Error Handling
```javascript
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    } else if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw error;
    }
  }
};
```

## 4. API Usage Best Practices

### 4.1 Rate Limiting
- **OSRM**: No explicit rate limit, but be reasonable
- **Nominatim**: 1 request per second maximum
- **OSM Tiles**: Max 2 concurrent connections

### 4.2 Caching Strategy
```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cachedApiCall = async (url) => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await apiCall(url);
  cache.set(url, { data, timestamp: Date.now() });
  return data;
};
```

### 4.3 Error Recovery
```javascript
const retryApiCall = async (url, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall(url);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```