import React, { useEffect, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import './HazardOverlay.css'

// Custom hazard icons with better visibility
const createHazardIcon = (type, color) => {
  const hazardEmojis = {
    'accident': '🚗💥',
    'bridge-collapse': '🌉⚠️',
    'flooding': '🌊',
    'construction': '🚧',
    'other': '⚠️'
  }

  return new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        border: 4px solid white;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        animation: hazardPulse 2s infinite;
        position: relative;
        z-index: 1000;
      ">
        <div style="font-size: 18px;">${hazardEmojis[type] || '⚠️'}</div>
      </div>
      <style>
        @keyframes hazardPulse {
          0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
          50% { transform: scale(1.15); box-shadow: 0 6px 16px rgba(255,0,0,0.8); }
          100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        }
      </style>
    `,
    className: 'hazard-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  })
}

// Create floating warning badge that appears above hazard
const createWarningBadge = (hazard) => {
  const severityColors = {
    'high': '#ff0000',
    'medium': '#ff8800', 
    'low': '#ffcc00',
    'user-reported': '#ff6b35'
  }
  
  const severityIcons = {
    'high': '🚨',
    'medium': '⚠️',
    'low': '⚡',
    'user-reported': '👤'
  }

  const color = severityColors[hazard.severity] || '#ff6b35'
  const icon = severityIcons[hazard.severity] || '⚠️'
  
  return new L.DivIcon({
    html: `
      <div style="
        position: relative;
        width: 120px;
        height: 90px;
        pointer-events: none;
      ">
        <!-- Warning Badge -->
        <div style="
          position: absolute;
          top: -65px;
          left: 50%;
          transform: translateX(-50%);
          background: ${color};
          color: white;
          padding: 8px 14px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.7);
          border: 3px solid white;
          animation: warningFloat 3s ease-in-out infinite;
          min-width: 90px;
          z-index: 1001;
        ">
          <div style="display: flex; align-items: center; gap: 6px; justify-content: center;">
            <span style="font-size: 16px;">${icon}</span>
            <span>HAZARD</span>
          </div>
          <div style="font-size: 11px; margin-top: 3px; opacity: 0.95; font-weight: normal;">
            ${hazard.type.toUpperCase().replace('-', ' ')}
          </div>
          
          <!-- Arrow pointing down -->
          <div style="
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid ${color};
          "></div>
        </div>
      </div>
      
      <style>
        @keyframes warningFloat {
          0%, 100% { 
            transform: translateX(-50%) translateY(0px);
            opacity: 1;
          }
          50% { 
            transform: translateX(-50%) translateY(-5px);
            opacity: 0.9;
          }
        }
      </style>
    `,
    className: 'hazard-warning-badge',
    iconSize: [120, 90],
    iconAnchor: [60, 45]
  })
}

const HazardOverlay = ({ hazards = [], onAIAlert }) => {
  useEffect(() => {
    // Alert AI about nearby hazards when new ones are added
    if (hazards.length > 0 && onAIAlert) {
      const latestHazard = hazards[hazards.length - 1]
      onAIAlert(latestHazard)
    }
  }, [hazards, onAIAlert])

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const hazardTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - hazardTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const getSeverityColor = (type) => {
    switch (type) {
      case 'accident':
      case 'bridge-collapse':
        return '#ff0000'
      case 'flooding':
        return '#0066cc'
      case 'construction':
        return '#ff8800'
      default:
        return '#ffcc00'
    }
  }

  const getHazardTitle = (type) => {
    const titles = {
      'accident': 'Traffic Accident',
      'bridge-collapse': 'Bridge Collapse',
      'flooding': 'Flooding',
      'construction': 'Construction Work',
      'other': 'Other Hazard'
    }
    return titles[type] || 'Unknown Hazard'
  }

  return (
    <>
      {hazards.map((hazard, index) => (
        <React.Fragment key={`hazard-${hazard.id || index}`}>
          {/* Main Hazard Marker */}
          <Marker
            position={[hazard.lat, hazard.lng]}
            icon={createHazardIcon(hazard.type, getSeverityColor(hazard.type))}
            zIndexOffset={1000}
          >
            <Popup className="hazard-popup">
              <div className="hazard-info">
                <div className="hazard-header">
                  <h4 style={{ color: getSeverityColor(hazard.type), margin: '0 0 8px 0' }}>
                    {getHazardTitle(hazard.type)}
                  </h4>
                  <span className="hazard-time" style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    fontStyle: 'italic' 
                  }}>
                    {formatTimeAgo(hazard.timestamp)}
                  </span>
                </div>
                <div className="hazard-location" style={{ marginBottom: '8px' }}>
                  <strong>📍 Location:</strong> {hazard.location}
                </div>
                <div className="hazard-description" style={{ marginBottom: '8px' }}>
                  <strong>📝 Description:</strong> {hazard.description}
                </div>
                <div className="hazard-severity" style={{ marginBottom: '12px' }}>
                  <strong>⚠️ Severity:</strong> 
                  <span 
                    style={{
                      display: 'inline-block',
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: getSeverityColor(hazard.type),
                      color: 'white'
                    }}
                  >
                    {(hazard.severity || 'USER REPORTED').toUpperCase()}
                  </span>
                </div>
                <div className="hazard-actions" style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  flexDirection: 'column' 
                }}>
                  <button 
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Report Update
                  </button>
                  <button 
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🚫 Avoid This Area
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
          
          {/* Warning Badge floating above hazard */}
          <Marker
            position={[hazard.lat, hazard.lng]}
            icon={createWarningBadge(hazard)}
            zIndexOffset={1001}
          />
        </React.Fragment>
      ))}
    </>
  )
}

export default HazardOverlay