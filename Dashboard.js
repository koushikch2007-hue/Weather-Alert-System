import React from 'react';

const WORKFLOW_STEPS = [
  { label: '⏰ Schedule trigger (every 30 min)', key: 'fetch' },
  { label: '🌐 Fetch weather from OpenWeatherMap', key: 'fetch' },
  { label: '🔍 Check thresholds (IF node)', key: 'check' },
  { label: '📧 Send Email / WhatsApp alert', key: 'notify' },
];

export default function Dashboard({ weather, n8nStatus, onCheck }) {
  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="page-sub">Live weather for {weather.city} · Updated by n8n every 30 minutes</div>

      <div className="weather-grid">
        <div className="metric-card">
          <div className="metric-emoji">🌡️</div>
          <div className="metric-label">Temperature</div>
          <div className="metric-value">{weather.temp}°</div>
          <div className="metric-sub">Feels like {weather.feelsLike}°C</div>
        </div>
        <div className="metric-card">
          <div className="metric-emoji">💧</div>
          <div className="metric-label">Humidity</div>
          <div className="metric-value">{weather.humidity}%</div>
          <div className="metric-sub">High</div>
        </div>
        <div className="metric-card">
          <div className="metric-emoji">🌬️</div>
          <div className="metric-label">Wind Speed</div>
          <div className="metric-value">{weather.wind}</div>
          <div className="metric-sub">km/h · SW</div>
        </div>
        <div className="metric-card">
          <div className="metric-emoji">🌧️</div>
          <div className="metric-label">Rain Chance</div>
          <div className="metric-value">{weather.rainChance}%</div>
          <div className="metric-sub">Evening</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">n8n workflow status</div>
        {WORKFLOW_STEPS.map((step, i) => (
          <div className="workflow-row" key={i}>
            <span>{step.label}</span>
            <span className="badge badge-success">✓ Running</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">How it works</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p>1. <strong>n8n</strong> runs a scheduled workflow every 30 minutes</p>
          <p>2. It calls the <strong>OpenWeatherMap API</strong> with your city name</p>
          <p>3. An <strong>IF node</strong> checks if the temperature/wind exceeds your threshold</p>
          <p>4. If triggered, n8n sends you an <strong>email or WhatsApp alert</strong></p>
          <p>5. This React dashboard shows you the current status and history</p>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onCheck}>
          🔄 Simulate a weather check
        </button>
      </div>
    </div>
  );
}
