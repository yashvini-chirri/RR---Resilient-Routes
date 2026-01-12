# Technical Specifications - Resilient Routes

## 1. System Architecture

### 1.1 Overall Architecture
- **Frontend-only Architecture**: Single Page Application (SPA)
- **Client-side Rendering**: React.js with Vite build tool
- **External API Integration**: OSRM, OpenStreetMap, Nominatim
- **No Backend Required**: Serverless architecture using external services

### 1.2 Component Architecture
```
App (Router)
├── HomePage (Landing & Route Input)
├── SuperMapLeaflet (Main Map Component)
│   ├── MapContainer (Leaflet Integration)
│   ├── AISafetyAgent (AI Assistant)
│   ├── SideMenu (Navigation Menu)
│   ├── LocationInput (Address Inputs)
│   ├── TransportModeSelector (Mode Selection)
│   └── HazardOverlay (Safety Warnings)
└── Services
    ├── SafetyRoutingService (Route Logic)
    └── chennaiSafetyData (Static Data)
```

## 2. Technology Stack

### 2.1 Core Technologies
- **Frontend Framework**: React.js 18.x
- **Build Tool**: Vite 4.x
- **Routing**: React Router 6.x
- **Language**: JavaScript ES6+
- **Package Manager**: npm

### 2.2 Mapping Technologies
- **Map Library**: Leaflet.js 1.9.x
- **React Integration**: React-Leaflet 4.x
- **Tile Provider**: OpenStreetMap
- **Routing API**: OSRM (Open Source Routing Machine)
- **Geocoding**: Nominatim

### 2.3 Styling & UI
- **CSS**: CSS3 with CSS Modules
- **Layout**: Flexbox & CSS Grid
- **Theme**: Custom dark theme
- **Icons**: Unicode emoji + custom SVG
- **Responsive**: Mobile-first design

## 3. API Integrations

### 3.1 OSRM Routing API
```javascript
Endpoint: https://router.project-osrm.org/route/v1/{profile}/{coordinates}
Parameters:
- profile: driving, cycling, walking
- coordinates: longitude,latitude pairs
- alternatives: true (for multiple routes)
- geometries: polyline
- overview: full
```

### 3.2 Nominatim Geocoding API
```javascript
Endpoint: https://nominatim.openstreetmap.org/search
Parameters:
- q: search query
- format: json
- limit: number of results
- countrycodes: IN (India)
- addressdetails: 1
```

### 3.3 OpenStreetMap Tiles
```javascript
Endpoint: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
Subdomains: a, b, c
Attribution: Required
Max Zoom: 18
```

## 4. Data Models

### 4.1 Route Data Structure
```javascript
{
  routes: [
    {
      geometry: "polyline_string",
      legs: [{
        steps: [],
        summary: "",
        weight: number,
        duration: number,
        distance: number
      }],
      weight_name: "routability",
      weight: number,
      duration: number,
      distance: number
    }
  ],
  waypoints: [
    {
      hint: "string",
      distance: number,
      name: "string",
      location: [longitude, latitude]
    }
  ]
}
```

### 4.2 Safety Data Structure
```javascript
{
  roads: [
    {
      name: "string",
      coordinates: [[lat, lng], [lat, lng]],
      safetyRating: number,
      averageSpeed: number,
      lightingQuality: "good|fair|poor",
      accidents: number,
      crimeRate: "low|medium|high"
    }
  ],
  hazards: [
    {
      id: "string",
      type: "accident|construction|weather|crime",
      severity: "low|medium|high|critical",
      location: [lat, lng],
      description: "string",
      expectedDuration: "string",
      reportedAt: "ISO_date"
    }
  ],
  safeZones: [
    {
      name: "string",
      bounds: [[lat, lng], [lat, lng]],
      type: "hospital|police|safe_area",
      facilities: ["string"],
      emergencyContacts: ["string"]
    }
  ]
}
```

### 4.3 Component State Structure
```javascript
// SuperMapLeaflet Component State
{
  routeInfo: RouteData | null,
  isCalculating: boolean,
  mapError: string | null,
  startCoords: [number, number] | null,
  endCoords: [number, number] | null,
  routePolyline: string | null,
  alternativeRoutes: Route[],
  selectedRouteIndex: number,
  hazards: Hazard[],
  aiAlertMessage: string,
  isSideMenuOpen: boolean
}
```

## 5. File Structure

### 5.1 Project Organization
```
src/
├── components/
│   ├── AISafetyAgent.jsx          # AI assistant component
│   ├── AISafetyAgent.css          # AI assistant styles
│   ├── HomePage.jsx               # Landing page
│   ├── HomePage.css               # Landing page styles
│   ├── HazardOverlay.jsx          # Hazard display component
│   ├── HazardOverlay.css          # Hazard overlay styles
│   ├── LocationInput.jsx          # Address input component
│   ├── LocationInput.css          # Address input styles
│   ├── SideMenu.jsx               # Navigation menu
│   ├── SideMenu.css               # Navigation menu styles
│   ├── SuperMapLeaflet.jsx        # Main map component
│   └── TransportModeSelector.jsx  # Transport mode selector
├── data/
│   └── chennaiSafetyData.js       # Static safety data
├── services/
│   └── SafetyRoutingService.js    # Routing logic service
├── App.jsx                        # Main app component
├── App.css                        # Global app styles
├── index.css                      # Global CSS reset
└── main.jsx                       # App entry point
```

### 5.2 Configuration Files
```
├── index.html                     # HTML template
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite configuration
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

## 6. Performance Specifications

### 6.1 Bundle Size Targets
- **Initial Bundle**: < 500KB gzipped
- **Vendor Libraries**: < 300KB gzipped
- **Application Code**: < 200KB gzipped
- **CSS**: < 50KB gzipped

### 6.2 Runtime Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

### 6.3 API Performance
- **Route Calculation**: < 3s (95th percentile)
- **Geocoding**: < 1s (95th percentile)
- **Map Tile Loading**: < 500ms per tile
- **Error Recovery**: < 1s for retry attempts

## 7. Development Environment

### 7.1 Required Tools
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Modern Browser**: Chrome 90+, Firefox 88+
- **Code Editor**: VS Code recommended
- **Git**: Version control

### 7.2 Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "format": "prettier --write src"
  }
}
```

### 7.3 Environment Variables
```javascript
// Development
VITE_APP_TITLE=Resilient Routes
VITE_OSRM_BASE_URL=https://router.project-osrm.org
VITE_NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org

// Production
VITE_ANALYTICS_ID=production_id
VITE_ERROR_REPORTING=enabled
```

## 8. Deployment Specifications

### 8.1 Build Process
- **Static Site Generation**: Vite build output
- **Asset Optimization**: Automatic minification & compression
- **Code Splitting**: Dynamic imports for route-based splitting
- **Source Maps**: Generated for debugging

### 8.2 Hosting Requirements
- **Static Hosting**: Any CDN or static host (Vercel, Netlify, GitHub Pages)
- **HTTPS**: Required for geolocation APIs
- **Custom Domain**: Optional
- **Environment**: Node.js not required for hosting

### 8.3 CI/CD Pipeline
```yaml
# Recommended GitHub Actions workflow
- Build: npm ci && npm run build
- Test: npm run lint && npm run test
- Deploy: Upload dist/ to hosting service
- Cache: node_modules caching for faster builds
```