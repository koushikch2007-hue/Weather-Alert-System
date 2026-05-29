import React from 'react';

export default function History({ log }) {
  return (
    <div>
      <div className="page-title">Alert History</div>
      <div className="page-sub">Every weather check and alert sent by n8n</div>

      <div className="card">
        {log.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No history yet. Click "Check now" to run your first check!</p>
          </div>
        ) : (
          log.map(entry => (
            <div className="log-item" key={entry.id}>
              <div className={`log-dot ${entry.type}`}></div>
              <div>
                <div className="log-text">{entry.text}</div>
                <div className="log-meta">{entry.time} · {entry.source}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
