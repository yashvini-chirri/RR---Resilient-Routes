# Resilient Routes

A comprehensive React.js safety navigation application that prioritizes user safety with real-time hazard detection, weather-aware routing, and AI assistance.

## Features

### Input Page (Home Screen)
- **Clean Interface**: Two input fields for current location and destination
- **Transport Mode Selection**: Four transport options with icons:
  - Car - Fastest for long distances
  - Motorcycle - Quick and agile
  - Bicycle - Eco-friendly option
  - Walking - Healthiest choice
- **GPS Integration**: Get current location automatically
- **Professional Design**: Minimal and user-friendly interface

### Route Analysis System
- **Dual Route Display**: 
  - 🔵 **Fastest Route** (Blue) - Standard quickest path
  - 🟢 **Safest Route** (Green) - Optimized for safety based on:
    - Historical accident data
    - Street lighting availability
    - Current hazard reports
- **Real-time Route Calculation**: Dynamic route optimization

### Hazard Detection & Reporting
- **Interactive Hazard Markers**: Visual indicators on map with details
- **Hazard Types Supported**:
  -  Traffic Accidents
  -  Bridge Collapse
  -  Flooding
  -  Construction
  -  Other Hazards
- **AI-Powered Reporting**: Conversational hazard reporting interface
- **Community Features**: User-generated hazard alerts for other travelers

### Side Menu Options
- **Report Hazard**: Interactive hazard reporting with AI assistance
- **Safety Guidelines**: Comprehensive safety rules for each transport mode
- **Emergency SOS**: Pre-filled emergency contact with location data
- **Change Destination**: Quick return to input page

### Agentic AI Assistance
- **Safety Prompts**: Mode-specific safety reminders:
  - Car: "Please wear your seatbelt."
  - Motorcycle: "Remember your helmet."
  - Bicycle: "Stay in the cycle lane and wear safety gear."
  - Walking: "Use pedestrian crossings for safety."
- **Turn-by-Turn Navigation**: Descriptive directions and traffic updates
- **Interactive Chat**: Ask questions about routes, safety, or report issues
- **Contextual Responses**: AI understands current conditions and provides relevant advice

### Weather-Aware Safety
- **Real-time Weather Integration**: Live weather data processing
- **Flood Risk Assessment**: Dynamic flood-prone area identification based on:
  - Rainfall intensity monitoring
  - Road elevation data analysis
  - Historical flooding patterns
- **Weather Hazard Warnings**: Automatic hazard placement during adverse conditions
- **Route Adjustments**: Weather-responsive route recommendations

### Final Map Screen
- **Simultaneous Route Display**: Both fastest and safest routes visible
- **Interactive Hazard Overlay**: Clickable hazard markers with detailed information
- **Persistent AI Assistant**: Always-available AI chat interface
- **Control Panel**: Easy access to SOS and destination change functions

## Technical Implementation

### Technologies Used
- **Frontend**: React.js 18+ with modern hooks
- **Routing**: React Router DOM for navigation
- **Maps**: Google Maps API integration ready
- **Styling**: CSS3 with modern features (Grid, Flexbox, Animations)
- **Build Tool**: Vite for fast development and building
- **Package Manager**: npm

### Project Structure
```
src/
├── components/
│   ├── HomePage.jsx           # Input page with location fields
│   ├── HomePage.css
│   ├── TransportModeSelector.jsx  # Transport mode icons
│   ├── TransportModeSelector.css
│   ├── MapView.jsx           # Main map interface
│   ├── MapView.css
│   ├── SideMenu.jsx          # Navigation menu
│   ├── SideMenu.css
│   ├── HazardOverlay.jsx     # Hazard markers and details
│   ├── HazardOverlay.css
│   ├── AIAssistant.jsx       # AI chat interface
│   └── AIAssistant.css
├── App.jsx                   # Main application component
├── App.css                   # Global styles
├── main.jsx                  # Application entry point
└── index.css                 # Base styles
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm package manager

### Installation
1. Clone or download the project
2. Navigate to project directory:
   ```bash
   cd safety-navigation-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`

### Production Build
Create optimized production build:
```bash
npm run build
```

## API Configuration

### Google Maps API Setup
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
3. Add your API key to the project (environment variables recommended)

### Weather API Integration
The app is designed to work with weather APIs like:
- OpenWeatherMap
- WeatherAPI
- AccuWeather

### External Services Integration
- **Emergency Services**: Configure SOS functionality with local emergency numbers
- **Traffic Data**: Integrate with traffic data providers for real-time updates
- **Elevation Data**: Connect to elevation APIs for flood risk assessment

## Features in Detail

### Responsive Design
- **Mobile-First**: Optimized for smartphones and tablets
- **Desktop Compatible**: Scales beautifully to desktop screens
- **Touch-Friendly**: Large touch targets and intuitive gestures

### Accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Indicators**: Clear focus states for all interactive elements

### Performance Optimizations
- **Lazy Loading**: Components load only when needed
- **Optimized Assets**: Compressed images and efficient CSS
- **Fast Routing**: Client-side routing with React Router
- **Efficient Rendering**: React optimizations and memoization

## Customization

### Adding New Transport Modes
1. Update the `transportModes` array in `TransportModeSelector.jsx`
2. Add corresponding safety prompts in `MapView.jsx`
3. Include new mode in safety guidelines in `SideMenu.jsx`

### Extending Hazard Types
1. Add new hazard types to the `hazardTypes` array in `SideMenu.jsx`
2. Update the `getHazardIcon` function in `HazardOverlay.jsx`
3. Add corresponding icons and styling

### Customizing AI Responses
1. Modify the `generateAIResponse` function in `AIAssistant.jsx`
2. Add new response categories and patterns
3. Integrate with external AI services if needed

## Future Enhancements

### Planned Features
- **Real Google Maps Integration**: Full Google Maps API implementation
- **Live Traffic Data**: Real-time traffic condition integration
- **Voice Navigation**: Speech synthesis for turn-by-turn directions
- **Offline Mode**: Cached maps and offline functionality
- **User Accounts**: Personal preferences and history
- **Social Features**: Community hazard validation and ratings

### Advanced Safety Features
- **Machine Learning**: Predictive hazard detection
- **IoT Integration**: Smart city sensor data integration
- **Emergency Network**: Direct emergency service communication
- **Health Monitoring**: Integration with fitness trackers for safety metrics

## Contributing

We welcome contributions! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React.js community for excellent documentation
- Google Maps team for comprehensive mapping APIs
- Open source weather data providers
- Icons and emojis from various open source projects

---

**Resilient Routes** - *Prioritizing your safety, one route at a time.* 
