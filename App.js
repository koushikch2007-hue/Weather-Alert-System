import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AlertList from './components/AlertList';
import AddAlert from './components/AddAlert';
import History from './components/History';
import Toast from './components/Toast';
import './App.css';

// ─── n8n webhook URL ──────────────────────────────────────────────────────────
// Replace this with your actual n8n webhook URL after setting up the workflow
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/weather-alert';

const INITIAL_ALERTS = [
  { id: 1, city: 'Hyderabad', type: 'temp-high', threshold: 38, unit: '°C', notify: 'Email + WhatsApp', enabled: true },
  { id: 2, city: 'Hyderabad', type: 'wind',      threshold: 40, unit: ' km/h', notify: 'Email only',        enabled: true },
  { id: 3, city: 'Hyderabad', type: 'temp-low',  threshold: 15, unit: '°C', notify: 'Email only',        enabled: false },
];

const INITIAL_WEATHER = {
  city: 'Hyderabad',
  temp: 32,
  feelsLike: 35,
  humidity: 74,
  wind: 18,
  rainChance: 62,
  condition: 'Partly Cloudy',
  icon: '🌤️',
};

const INITIAL_LOG = [
  { id: 1, type: 'danger',  text: '🔴 High temp alert sent — Hyderabad hit 39°C (threshold: 38°C)', time: 'Today, 2:15 PM', source: 'n8n workflow' },
  { id: 2, type: 'warn',    text: '🟡 Wind speed nearing limit — 37 km/h (threshold: 40 km/h)',      time: 'Today, 11:30 AM', source: 'No alert sent' },
  { id: 3, type: 'info',    text: '🔵 Weather check completed — all clear',                          time: 'Today, 8:00 AM', source: 'n8n workflow' },
  { id: 4, type: 'success', text: '🟢 Alert system started successfully',                            time: 'Yesterday, 9:00 PM', source: 'System' },
];

export default function App() {
  const [tab, setTab]         = useState('dashboard');
  const [alerts, setAlerts]   = useState(INITIAL_ALERTS);
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  const [log, setLog]         = useState(INITIAL_LOG);
  const [lastCheck, setLastCheck] = useState('just now');
  const [toast, setToast]     = useState(null);
  const [n8nStatus, setN8nStatus] = useState({ fetch: 'running', check: 'running', notify: 'running' });

  // ── show a toast notification ────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ── add to history log ───────────────────────────────────────────────────
  const addLog = (type, text, source = 'n8n workflow') => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLog(prev => [{ id: Date.now(), type, text, time: `Today, ${time}`, source }, ...prev]);
  };

  // ── simulate fetching weather (calls n8n webhook) ────────────────────────
  const checkWeather = async () => {
    const temps  = [29, 31, 34, 36, 38, 40, 42];
    const winds  = [12, 18, 28, 38, 44, 52];
    const newTemp = temps[Math.floor(Math.random() * temps.length)];
    const newWind = winds[Math.floor(Math.random() * winds.length)];

    setWeather(prev => ({ ...prev, temp: newTemp, wind: newWind }));
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLastCheck(now);

    // Check against enabled alerts
    let alerted = false;
    alerts.filter(a => a.enabled).forEach(alert => {
      if (alert.type === 'temp-high' && newTemp >= alert.threshold) {
        addLog('danger', `🔴 Temp alert sent — ${alert.city} hit ${newTemp}°C (threshold: ${alert.threshold}°C)`, alert.notify);
        showToast(`🔴 Alert! ${newTemp}°C in ${alert.city} — notified via ${alert.notify}`);
        alerted = true;
        triggerN8nWebhook({ city: alert.city, type: 'HIGH_TEMP', value: newTemp, threshold: alert.threshold, notify: alert.notify });
      }
      if (alert.type === 'wind' && newWind >= alert.threshold) {
        addLog('warn', `🟡 Wind alert sent — ${alert.city} wind at ${newWind} km/h (threshold: ${alert.threshold} km/h)`, alert.notify);
        if (!alerted) showToast(`🟡 Wind alert! ${newWind} km/h in ${alert.city}`);
        alerted = true;
        triggerN8nWebhook({ city: alert.city, type: 'HIGH_WIND', value: newWind, threshold: alert.threshold, notify: alert.notify });
      }
    });

    if (!alerted) {
      addLog('info', `🔵 Weather check — ${newTemp}°C, ${newWind} km/h wind — all clear`, 'No alerts triggered');
      showToast(`✅ Checked at ${now} — ${newTemp}°C, no alerts triggered`);
    }
  };

  // ── send data to n8n webhook ─────────────────────────────────────────────
  const triggerN8nWebhook = async (payload) => {
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // n8n not connected yet — that's okay during development
      console.log('n8n webhook not connected yet. Payload:', payload);
    }
  };

  // ── toggle alert on/off ──────────────────────────────────────────────────
  const toggleAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    const alert = alerts.find(a => a.id === id);
    showToast(alert?.enabled ? 'Alert paused' : 'Alert enabled');
  };

  // ── delete alert ─────────────────────────────────────────────────────────
  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alert deleted');
  };

  // ── add new alert ─────────────────────────────────────────────────────────
  const addAlert = (newAlert) => {
    const units = { 'temp-high': '°C', 'temp-low': '°C', 'wind': ' km/h', 'rain': '%' };
    const alert = { ...newAlert, id: Date.now(), unit: units[newAlert.type], enabled: true };
    setAlerts(prev => [...prev, alert]);
    addLog('success', `🟢 New alert added — ${newAlert.type} for ${newAlert.city} at ${newAlert.threshold}${units[newAlert.type]}`, 'User');
    showToast(`✅ Alert saved! n8n will notify you at ${newAlert.threshold}${units[newAlert.type]}`);
    setTab('alerts');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⛅</span>
          <div>
            <div className="brand-name">WeatherAlert</div>
            <div className="brand-sub">powered by n8n</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { key: 'dashboard', icon: '📊', label: 'Dashboard' },
            { key: 'alerts',    icon: '🔔', label: 'My Alerts' },
            { key: 'add',       icon: '➕', label: 'Add Alert' },
            { key: 'log',       icon: '📋', label: 'History' },
          ].map(item => (
            <button
              key={item.key}
              className={`nav-item ${tab === item.key ? 'active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-status">
          <div className="status-dot-wrap">
            <span className="status-dot" />
            <span>n8n connected</span>
          </div>
          <div className="status-check">Last check: {lastCheck}</div>
          <button className="check-btn" onClick={checkWeather}>
            🔄 Check now
          </button>
        </div>
      </aside>

      <main className="main-content">
        {tab === 'dashboard' && (
          <Dashboard weather={weather} n8nStatus={n8nStatus} onCheck={checkWeather} />
        )}
        {tab === 'alerts' && (
          <AlertList alerts={alerts} onToggle={toggleAlert} onDelete={deleteAlert} onAdd={() => setTab('add')} />
        )}
        {tab === 'add' && (
          <AddAlert onSave={addAlert} onCancel={() => setTab('alerts')} />
        )}
        {tab === 'log' && (
          <History log={log} />
        )}
      </main>

      {toast && <Toast message={toast} />}
    </div>
  );
}
