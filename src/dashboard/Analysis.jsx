import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import MarketCard from '../components/MarketCard';
import FilterSidebar from './FilterSidebar';
import AnalysisDashboard from './AnalysisDashboard';
import { searchMarkets, getInsights } from '../services/marketAPI';
import './Analysis.css';

export default function Analysis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    platforms: [],
    categories: [],
    timeHorizon: 'Any time',
    minVolume: 0,
    openOnly: true
  });

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]); 

  // Separate effect for filtering so we don't re-fetch insights on filter change
  // Note: This requires us to store "allFetchedMarkets" separately if we want to support
  // re-filtering without re-fetching, but for now we'll just filter the current 'markets' state 
  // or better: keep 'allMarkets' and 'displayedMarkets'.
  // To keep it simple for this iteration:
  // We'll apply filters to the markets we received from the API. 
  // Ideally, we'd store the raw result and derive displayed markets.
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setInsights(null); // Reset previous insights
    
    try {
      // Use getInsights to fetch both markets and AI analysis
      // This might be slower than just searchMarkets, but provides the rich data
      const data = await getInsights(searchQuery);
      
      // data contains { markets, aggregates, summary, ... }
      setMarkets(data.markets || []);
      setInsights(data);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      // Fallback to basic search if insights fail
      try {
        const fallbackMarkets = await searchMarkets(searchQuery);
        setMarkets(fallbackMarkets);
      } catch (fallbackErr) {
        setError(fallbackErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query === initialQuery) return;
    setSearchParams({ q: query }); 
  };

  // Apply client-side filters to the markets we have
  const displayedMarkets = markets.filter(m => {
    if (filters.platforms.length > 0 && !filters.platforms.includes(m.platform)) return false;
    if (filters.categories.length > 0 && m.category && !filters.categories.includes(m.category)) return false;
    if (filters.openOnly && m.closed) return false;
    if (filters.minVolume > 0) {
      const vol = parseFloat(m.volume_total || m.volume || 0);
      if (vol < filters.minVolume) return false;
    }
    return true;
  });

  return (
    <div className="analysis-page-layout">
      <FilterSidebar filters={filters} onFilterChange={setFilters} />
      
      <main className="analysis-main">
        <div className="sticky-search-header">
          <form onSubmit={handleSearch} className="search-form">
            <SearchIcon className="search-icon" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the future..."
              className="search-input"
            />
            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? 'Analyzing...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="results-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing market data & generating insights...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && markets.length > 0 && (
            <div className="results-grid-container">
              
              {/* Analysis Dashboard Section */}
              <AnalysisDashboard 
                markets={displayedMarkets} 
                query={initialQuery} 
                insights={insights} 
              />

              <div className="results-meta">
                <h2>Underlying Markets</h2>
                <span className="count">{displayedMarkets.length} markets found</span>
              </div>
              <div className="markets-list">
                {displayedMarkets.map((market, i) => (
                  <MarketCard key={market.id || i} market={market} />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && markets.length === 0 && initialQuery && (
            <div className="empty-state">
              <p>No markets found matching your query.</p>
            </div>
          )}

          {!initialQuery && (
            <div className="empty-state intro">
              <h2>Ready to explore?</h2>
              <p>Use the search bar to find markets or browse categories on the left.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
