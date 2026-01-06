import React from 'react';
import './ResearchPanel.css';

/**
 * ResearchPanel component displays web research results alongside prediction markets
 * Shows bull/bear cases, key events, and source citations
 */
export default function ResearchPanel({ research, query }) {
  if (!research) {
    return null;
  }

  const {
    summary,
    bull_case = [],
    bear_case = [],
    key_events = [],
    web_confidence = 'medium',
    sources = []
  } = research;

  // Map confidence to color/icon - professional styling
  const confidenceConfig = {
    low: { label: 'Low Confidence', color: '#888', icon: '◐' },
    medium: { label: 'Medium Confidence', color: '#aaa', icon: '◐' },
    high: { label: 'High Confidence', color: '#ccc', icon: '◐' }
  };

  const confidence = confidenceConfig[web_confidence] || confidenceConfig.medium;

  return (
    <div className="research-panel">
      <div className="research-header">
        <h2>Web Research Analysis</h2>
        <div className="research-confidence" style={{ color: confidence.color }}>
          <span className="confidence-icon">{confidence.icon}</span>
          <span className="confidence-label">{confidence.label}</span>
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="research-section research-summary">
          <h3>Executive Summary</h3>
          <div className="summary-content">
            {summary.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Bull and Bear Cases Side by Side */}
      <div className="cases-container">
        {/* Bull Case */}
        {bull_case && bull_case.length > 0 && (
          <div className="research-section case-section bull-case">
            <h3>
              <span className="case-icon">📈</span>
              Bull Case
            </h3>
            <ul className="case-list">
              {bull_case.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bear Case */}
        {bear_case && bear_case.length > 0 && (
          <div className="research-section case-section bear-case">
            <h3>
              <span className="case-icon">📉</span>
              Bear Case
            </h3>
            <ul className="case-list">
              {bear_case.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Key Events */}
      {key_events && key_events.length > 0 && (
        <div className="research-section key-events">
          <h3>
            <span className="section-icon">📅</span>
            Key Events to Watch
          </h3>
          <ul className="events-list">
            {key_events.map((event, i) => (
              <li key={i} className="event-item">
                <span className="event-marker"></span>
                <span className="event-text">{event}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {sources && sources.length > 0 && (
        <div className="research-section sources-section">
          <h3>
            <span className="section-icon">🔗</span>
            Sources ({sources.length})
          </h3>
          <div className="sources-list">
            {sources.map((source, i) => (
              <div key={i} className="source-item">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  <span className="source-number">{i + 1}</span>
                  <div className="source-content">
                    <div className="source-title">{source.title}</div>
                    {source.reason && (
                      <div className="source-reason">{source.reason}</div>
                    )}
                  </div>
                  <span className="external-icon">↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="research-footer">
        <p className="research-disclaimer">
          Web research provides context and evidence from recent sources. 
          It complements, but does not replace, prediction market data.
        </p>
      </div>
    </div>
  );
}

