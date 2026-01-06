import { useState } from 'react';
import { Filter, Check, ChevronDown, ChevronUp } from 'lucide-react';
import './FilterSidebar.css';

export default function FilterSidebar({ filters, onFilterChange }) {
  // Platform options
  const platforms = [
    { id: 'polymarket', label: 'Polymarket' },
    { id: 'kalshi', label: 'Kalshi' }
  ];

  // Category options from the user spec
  const categories = [
    'POLITICS_AND_GOVERNMENT',
    'MACRO_ECONOMY',
    'MONETARY_POLICY',
    'EQUITIES',
    'COMMODITIES',
    'CRYPTO',
    'SPORTS',
    'WEATHER',
    'TECH_INNOVATION',
    'GEOPOLITICS',
    'EVENTS_AND_ENTERTAINMENT',
    'SCIENCE_AND_AI',
    'MISCELLANEOUS'
  ];

  const [expandedSections, setExpandedSections] = useState({
    platforms: true,
    categories: true,
    time: true,
    liquidity: true,
    status: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePlatformChange = (platformId) => {
    const current = filters.platforms || [];
    const next = current.includes(platformId)
      ? current.filter(p => p !== platformId)
      : [...current, platformId];
    onFilterChange({ ...filters, platforms: next });
  };

  const handleCategoryChange = (cat) => {
    const current = filters.categories || [];
    const next = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    onFilterChange({ ...filters, categories: next });
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <Filter size={16} />
        <span>Filters</span>
      </div>

      {/* Platforms */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection('platforms')}>
          <h3>Platforms</h3>
          {expandedSections.platforms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {expandedSections.platforms && (
          <div className="section-content">
            {platforms.map(p => (
              <label key={p.id} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={(filters.platforms || []).includes(p.id)}
                  onChange={() => handlePlatformChange(p.id)}
                />
                <span className="checkbox-custom"><Check size={10} /></span>
                {p.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection('categories')}>
          <h3>Categories</h3>
          {expandedSections.categories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {expandedSections.categories && (
          <div className="section-content scrollable">
            {categories.map(cat => (
              <label key={cat} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={(filters.categories || []).includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className="checkbox-custom"><Check size={10} /></span>
                {cat.replace(/_/g, ' ')}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Time Horizon */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection('time')}>
          <h3>Time Horizon</h3>
          {expandedSections.time ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {expandedSections.time && (
          <div className="section-content">
             {['Any time', 'Next 3 months', 'Next year'].map((t) => (
               <label key={t} className="radio-label">
                 <input 
                   type="radio" 
                   name="timeHorizon"
                   checked={filters.timeHorizon === t}
                   onChange={() => onFilterChange({ ...filters, timeHorizon: t })}
                 />
                 <span className="radio-custom"></span>
                 {t}
               </label>
             ))}
          </div>
        )}
      </div>

      {/* Liquidity */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection('liquidity')}>
          <h3>Liquidity</h3>
          {expandedSections.liquidity ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {expandedSections.liquidity && (
          <div className="section-content">
            <div className="slider-container">
               <label>Min Volume: ${filters.minVolume || 0}</label>
               <input 
                 type="range" 
                 min="0" 
                 max="1000000" 
                 step="10000" 
                 value={filters.minVolume || 0}
                 onChange={(e) => onFilterChange({ ...filters, minVolume: parseInt(e.target.value) })}
               />
               <div className="slider-labels">
                 <span>0</span>
                 <span>1M+</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection('status')}>
          <h3>Status</h3>
          {expandedSections.status ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {expandedSections.status && (
          <div className="section-content">
             <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.openOnly}
                  onChange={(e) => onFilterChange({ ...filters, openOnly: e.target.checked })}
                />
                <span className="checkbox-custom"><Check size={10} /></span>
                Open markets only
             </label>
          </div>
        )}
      </div>

    </aside>
  );
}
