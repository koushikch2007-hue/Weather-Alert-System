import React from 'react';

const TYPE_LABELS = {
  'temp-high': '🌡️ High temperature',
  'temp-low':  '❄️ Low temperature',
  'wind':      '🌬️ High wind speed',
  'rain':      '🌧️ Heavy rain chance',
};

const BADGE_CLASS = {
  'temp-high': 'badge-danger',
  'temp-low':  'badge-info',
  'wind':      'badge-warn',
  'rain':      'badge-info',
};

export default function AlertList({ alerts, onToggle, onDelete, onAdd }) {
  return (
    <div>
      <div className="page-title">My Alerts</div>
      <div className="page-sub">Manage your weather thresholds — n8n checks these every 30 minutes</div>

      <div className="card">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p>No alerts yet.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={onAdd}>
              + Add your first alert
            </button>
          </div>
        ) : (
          alerts.map(alert => (
            <div className="alert-item" key={alert.id}>
              <div className="alert-info">
                <h3>{TYPE_LABELS[alert.type]} · {alert.city}</h3>
                <p>Alert at {alert.threshold}{alert.unit} · {alert.notify}</p>
              </div>
              <div className="alert-controls">
                <span className={`badge ${BADGE_CLASS[alert.type]}`}>
                  {alert.threshold}{alert.unit}
                </span>
                <label className="toggle" title={alert.enabled ? 'Disable alert' : 'Enable alert'}>
                  <input
                    type="checkbox"
                    checked={alert.enabled}
                    onChange={() => onToggle(alert.id)}
                  />
                  <span className="toggle-track"></span>
                  <span className="toggle-thumb"></span>
                </label>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(alert.id)}
                  title="Delete alert"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <button className="btn btn-primary" onClick={onAdd}>
          + Add another alert
        </button>
      )}
    </div>
  );
}
