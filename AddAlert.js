import React, { useState } from 'react';

const TYPE_OPTIONS = [
  { value: 'temp-high', label: '🌡️ High temperature', min: 20, max: 50, default: 38, unit: '°C' },
  { value: 'temp-low',  label: '❄️ Low temperature',  min: 0,  max: 25, default: 15, unit: '°C' },
  { value: 'wind',      label: '🌬️ High wind speed',  min: 10, max: 100, default: 40, unit: ' km/h' },
  { value: 'rain',      label: '🌧️ Heavy rain chance', min: 10, max: 100, default: 70, unit: '%' },
];

export default function AddAlert({ onSave, onCancel }) {
  const [form, setForm] = useState({
    city: 'Hyderabad',
    type: 'temp-high',
    threshold: 38,
    notify: 'Email only',
    email: '',
  });

  const currentType = TYPE_OPTIONS.find(t => t.value === form.type);

  const handleTypeChange = (e) => {
    const type = TYPE_OPTIONS.find(t => t.value === e.target.value);
    setForm(f => ({ ...f, type: e.target.value, threshold: type.default }));
  };

  const handleSubmit = () => {
    if (!form.city.trim()) { alert('Please enter a city name'); return; }
    if (!form.email.trim()) { alert('Please enter your email'); return; }
    onSave(form);
  };

  return (
    <div>
      <div className="page-title">Add Alert</div>
      <div className="page-sub">n8n will notify you when your threshold is crossed</div>

      <div className="card">
        <div className="form-group">
          <label className="form-label">City name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Hyderabad, Mumbai, Delhi"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
          />
        </div>

        <div className="form-row" style={{ marginBottom: '1.1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Alert type</label>
            <select className="form-select" value={form.type} onChange={handleTypeChange}>
              {TYPE_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Notify via</label>
            <select
              className="form-select"
              value={form.notify}
              onChange={e => setForm(f => ({ ...f, notify: e.target.value }))}
            >
              <option>Email only</option>
              <option>WhatsApp only</option>
              <option>Email + WhatsApp</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Threshold: <strong>{form.threshold}{currentType?.unit}</strong>
          </label>
          <div className="range-wrap">
            <input
              type="range"
              min={currentType?.min}
              max={currentType?.max}
              step="1"
              value={form.threshold}
              onChange={e => setForm(f => ({ ...f, threshold: Number(e.target.value) }))}
            />
            <span className="range-val">{form.threshold}{currentType?.unit}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your email</label>
          <input
            type="email"
            className="form-input"
            placeholder="you@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>

        <div className="card" style={{ background: 'var(--surface2)', border: '1px dashed var(--border-strong)', marginTop: 4 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            <strong>📡 n8n will receive:</strong> city="{form.city}", type="{form.type}",
            threshold={form.threshold}{currentType?.unit}, notify="{form.notify}"
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            🔔 Save alert
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
