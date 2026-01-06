import { memo } from 'react';
import { TrendingUp, DollarSign, Calendar, ExternalLink, BarChart2, Droplets, Clock } from 'lucide-react';
import './MarketCard.css';

function MarketCard({ market, onClick }) {
  const {
    title,
    question,
    platform,
    volume_total,
    volume,
    liquidity,
    end_time,
    end_date_iso,
    outcomes,
    outcomePrices,
    slug,
    category,
    subcategory,
    llm_tags
  } = market;

  // Display Logic
  const displayTitle = title || question || 'Unknown Market';
  
  // Ensure numeric values - parse strings and handle null/undefined
  const displayVolume = parseFloat(volume_total || volume || 0) || 0;
  const displayLiquidity = parseFloat(liquidity || 0) || 0;

  const formatCurrency = (val) => {
    // Convert to number if it's a string
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    // Handle invalid numbers
    if (isNaN(numVal) || numVal === null || numVal === undefined) {
      return '$0';
    }
    
    if (numVal >= 1000000) return `$${(numVal / 1000000).toFixed(1)}M`;
    if (numVal >= 1000) return `$${(numVal / 1000).toFixed(1)}k`;
    return `$${numVal.toFixed(0)}`;
  };

  // Probability Logic
  let displayProbability = null;
  let outcomeLabel = 'Yes';
  
  if (outcomes && outcomePrices) {
    try {
      const outcomesArray = typeof outcomes === 'string' ? JSON.parse(outcomes) : outcomes;
      const pricesArray = typeof outcomePrices === 'string' ? JSON.parse(outcomePrices) : outcomePrices;

      if (Array.isArray(outcomesArray) && Array.isArray(pricesArray)) {
        // Default to first outcome (usually "Yes")
        const yesPrice = parseFloat(pricesArray[0]);
        if (!isNaN(yesPrice)) {
          displayProbability = yesPrice;
          outcomeLabel = outcomesArray[0];
        }
      }
    } catch (e) {
      console.error("Error parsing outcomes/prices:", e);
    }
  }

  // Date Logic
  let endDate = null;
  if (end_date_iso) {
    endDate = new Date(end_date_iso);
  } else if (end_time) {
    endDate = new Date(end_time * 1000);
  }
  const isExpired = endDate && endDate < new Date();

  // Tags Logic
  let tags = [];
  if (llm_tags) {
    try {
      tags = typeof llm_tags === 'string' ? JSON.parse(llm_tags) : llm_tags;
      // Ensure it's an array
      if (!Array.isArray(tags)) {
        tags = [];
      }
    } catch (e) {
      console.error('Error parsing llm_tags:', e);
      tags = [];
    }
  }
  // Limit tags to 3
  const displayTags = tags.slice(0, 3);

  const marketUrl = slug ? `https://polymarket.com/market/${slug}` : '#';

  return (
    <div className="market-card" onClick={onClick}>
      <div className="market-card-header">
        <div className="platform-badge">
          <img src={platform === 'polymarket' ? '/polymarket-logo.png' : '/globe.svg'} alt={platform} className="platform-icon" onError={(e) => e.target.style.display = 'none'} />
          <span>{platform || 'Prediction Market'}</span>
        </div>
        {category && (
          <div className="category-chips">
            <span className="category-chip">{category.replace(/_/g, ' ')}</span>
            {subcategory && <span className="subcategory-chip">· {subcategory.replace(/_/g, ' ')}</span>}
          </div>
        )}
      </div>

      <h3 className="market-title">
        {displayTitle}
      </h3>

      <div className="market-probability-section">
        <div className="probability-value">
          {displayProbability !== null ? `${(displayProbability * 100).toFixed(0)}%` : '--'}
        </div>
        <div className="probability-label">
          Implied probability ({outcomeLabel})
        </div>
      </div>

      <div className="market-stats-grid">
        <div className="stat-item" title="Total Volume">
          <BarChart2 size={14} />
          <span>{formatCurrency(displayVolume)} Vol</span>
        </div>
        <div className="stat-item" title="Liquidity">
          <Droplets size={14} />
          <span>{formatCurrency(displayLiquidity)} Liq</span>
        </div>
        {/* Spread would go here if available */}
        <div className="stat-item" title="End Date">
          <Clock size={14} />
          <span>{endDate ? endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
        </div>
      </div>

      {displayTags.length > 0 && (
        <div className="market-tags">
          {displayTags.map((tag, i) => (
            <span key={i} className="market-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="market-actions">
        {marketUrl !== '#' && (
          <a 
            href={marketUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="action-link"
            onClick={(e) => e.stopPropagation()}
          >
            Open on {platform} <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default memo(MarketCard);