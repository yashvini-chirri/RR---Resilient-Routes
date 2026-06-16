import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import SuperMapLeaflet from './components/SuperMapLeaflet'
import './App.css'

function App() {
  const [routeData, setRouteData] = useState(null)
  const [transportMode, setTransportMode] = useState('car')

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                setRouteData={setRouteData} 
                transportMode={transportMode}
                setTransportMode={setTransportMode}
              />
            } 
          />
          <Route 
            path="/map" 
            element={
              <SuperMapLeaflet 
                routeData={routeData} 
                transportMode={transportMode}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App