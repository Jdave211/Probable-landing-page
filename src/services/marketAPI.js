/**
 * Market API service - Fetches markets from backend API
 * Uses Vite proxy in dev: /api/* -> http://localhost:3001/api/*
 * In production, set VITE_API_URL=https://probable-api-app-d4a064dc7b26.herokuapp.com
 */

// Use empty string so Vite proxy handles /api prefix
// If VITE_API_URL is set, it will override this (useful for production)
let API_BASE = import.meta.env.VITE_API_URL || '';

// Prevent double /api prefix issue
if (API_BASE.endsWith('/api')) {
  API_BASE = API_BASE.slice(0, -4); // Remove trailing /api
}

// Debug: Log API base to help diagnose issues
if (import.meta.env.DEV) {
  console.log('API_BASE:', API_BASE || '(empty - using Vite proxy)');
}

/**
 * Search markets using natural language query
 * @param {string} query - The search query
 * @param {boolean} includeResearch - Whether to include web research (default: true)
 * @returns {Promise<Object>} Object with markets, research, and query
 */
export async function searchMarkets(query, includeResearch = true) {
  try {
    const response = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        includeResearch,
        limit: 30
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return structured response with markets and research
    return {
      markets: data.markets || data.data || [],
      research: data.research || null,
      query: data.query || query
    };
  } catch (error) {
    console.error('Search error:', error);
    // Fallback: try direct markets endpoint (without research)
    const markets = await fetchAllMarkets(query);
    return {
      markets: Array.isArray(markets) ? markets : [],
      research: null,
      query
    };
  }
}

/**
 * Get AI-generated insights and markets for a query
 * Now includes web research alongside market analysis
 */
export async function getInsights(query) {
  try {
    const response = await fetch(`${API_BASE}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: query }),
    });

    if (!response.ok) {
      throw new Error(`Insights failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Returns { summary, sentiment, insights, markets, aggregates, research, ... }
    return {
      ...data,
      markets: data.markets || [],
      research: data.research || null
    };
  } catch (error) {
    console.error('Insights error:', error);
    throw error;
  }
}

/**
 * Fetch all markets (fallback or direct)
 */
export async function fetchAllMarkets(searchQuery = '') {
  try {
    const params = new URLSearchParams({
      limit: '50',
      ...(searchQuery && { search: searchQuery }),
    });

    const response = await fetch(`${API_BASE}/api/markets?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch markets: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.markets || []);
  } catch (error) {
    console.error('Fetch markets error:', error);
    throw new Error('Failed to fetch markets. Please check your connection.');
  }
}
