import React, { useState, useEffect, useRef } from 'react'
import './AIAssistant.css'

const AIAssistant = ({ messages, transportMode, weather, onMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Weather-aware alerts
    if (weather?.condition === 'light-rain' && weather?.precipitation > 2) {
      const weatherAlert = {
        id: Date.now(),
        text: `⚠️ Light rain detected (${weather.precipitation}mm). Be cautious of potential flooding in low-lying areas. Recommended to use main roads.`,
        type: 'weather-alert'
      }
      onMessage(weatherAlert)
    }
  }, [weather, onMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      type: 'user',
      timestamp: new Date()
    }

    onMessage(userMessage)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, transportMode)
      onMessage(aiResponse)
    }, 1000)

    setInputValue('')
  }

  const generateAIResponse = (userInput, mode) => {
    const responses = {
      directions: [
        `For ${mode} navigation: Continue straight for 200m, then turn right at the traffic light.`,
        `Next instruction: In 300m, take the left fork to stay on the safer route.`,
        `Traffic update: Minor congestion ahead, estimated delay 3 minutes.`
      ],
      safety: [
        'Remember to stay alert and follow traffic rules.',
        'Current weather conditions may affect visibility. Please drive carefully.',
        'Your selected route avoids known hazard areas.'
      ],
      hazard: [
        'Thank you for reporting this hazard. Other users in the area will be notified.',
        'I\'ve updated the route to avoid the reported hazard area.',
        'Emergency services have been notified of the hazard you reported.'
      ]
    }

    let category = 'safety'
    if (userInput.toLowerCase().includes('direction') || userInput.toLowerCase().includes('navigate')) {
      category = 'directions'
    } else if (userInput.toLowerCase().includes('hazard') || userInput.toLowerCase().includes('report')) {
      category = 'hazard'
    }

    const responseTexts = responses[category]
    const randomResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)]

    return {
      id: Date.now(),
      text: randomResponse,
      type: 'ai-response',
      timestamp: new Date()
    }
  }

  const getMessageIcon = (type) => {
    const icons = {
      'safety-prompt': '🛡️',
      'weather-alert': '🌧️',
      'emergency': '🆘',
      'confirmation': '✅',
      'ai-response': '🤖',
      'user': '👤'
    }
    return icons[type] || '💬'
  }

  const getMessageClass = (type) => {
    return `message ${type.replace('-', '_')}`
  }

  return (
    <div className={`ai-assistant ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="assistant-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="assistant-info">
          <span className="assistant-icon">🤖</span>
          <span className="assistant-title">AI Safety Assistant</span>
          {messages.length > 0 && !isExpanded && (
            <span className="message-count">{messages.length}</span>
          )}
        </div>
        <button className="expand-btn">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="assistant-content">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={getMessageClass(message.type)}>
                <span className="message-icon">{getMessageIcon(message.type)}</span>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.timestamp && (
                    <div className="message-timestamp">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <input
              type="text"
              className="message-input"
              placeholder="Ask about directions, safety, or report issues..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              📤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAssistant