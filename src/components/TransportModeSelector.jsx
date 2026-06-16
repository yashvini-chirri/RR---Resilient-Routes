import React from 'react'
import './TransportModeSelector.css'

const TransportModeSelector = ({ selectedMode, onModeSelect }) => {
  const transportModes = [
    {
      id: 'car',
      name: 'Car',
      icon: '🚗',
      description: 'Fastest for long distances'
    },
    {
      id: 'bike',
      name: 'Motorcycle',
      icon: '🏍️',
      description: 'Quick and agile'
    },
    {
      id: 'bicycle',
      name: 'Bicycle',
      icon: '🚴',
      description: 'Eco-friendly option'
    },
    {
      id: 'walking',
      name: 'Walking',
      icon: '🚶',
      description: 'Healthiest choice'
    }
  ]

  return (
    <div className="transport-selector">
      <label className="selector-label">Choose Transport Mode</label>
      <div className="transport-grid">
        {transportModes.map((mode) => (
          <button
            key={mode.id}
            className={`transport-option ${selectedMode === mode.id ? 'selected' : ''}`}
            onClick={() => onModeSelect(mode.id)}
            type="button"
          >
            <div className="transport-icon">{mode.icon}</div>
            <div className="transport-name">{mode.name}</div>
            <div className="transport-description">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TransportModeSelector