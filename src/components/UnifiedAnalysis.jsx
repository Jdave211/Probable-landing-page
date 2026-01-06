import React, { useState, useMemo } from 'react';
import MarketCard from './MarketCard';
import { ChevronDown, ChevronUp, ExternalLink, Calendar, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import './UnifiedAnalysis.css';

/**
 * UnifiedAnalysis - Integrates prediction markets with web research
 * Uses research to enhance, validate, and provide context for markets
 */
export default function UnifiedAnalysis({ markets = [], research, query }) {
  const [expandedMarkets, setExpandedMarkets] = useState(new Set());
  const [showSources, setShowSources] = useState(false);

  // Enhance markets with research insights
  const enhancedMarkets = useMemo(() => {
    if (!research || !markets.length) return markets;

    return markets.map(market => {
      // Calculate market probability
      let marketProb = 0.5;
      if (market.outcomePrices) {
        try {
          const prices = typeof market.outcomePrices === 'string' 
            ? JSON.parse(market.outcomePrices) 
            : market.outcomePrices;
          marketProb = parseFloat(prices[0]) || 0.5;
        } catch (e) {}
      }

      // Match research insights to this market
      const marketTitle = (market.title || market.question || '').toLowerCase();
      let researchAlignment = 'neutral';
      let researchNotes = [];
      let hasResearchContext = false;

      // First, try to use market_insights from research (LLM-matched)
      if (research.market_insights && Array.isArray(research.market_insights)) {
        for (const insight of research.market_insights) {
          const insightTitle = (insight.market_title || '').toLowerCase();
          // Check if this insight matches this market (fuzzy match)
          if (insightTitle && marketTitle.includes(insightTitle) || 
              marketTitle.includes(insightTitle.split(' ')[0]) ||
              insightTitle.includes(marketTitle.split(' ')[0])) {
            hasResearchContext = true;
            researchNotes = insight.relevant_insights || [];
            // Determine alignment based on market probability and research notes
            if (marketProb > 0.6 && researchNotes.length > 0) {
              researchAlignment = 'supported';
            } else if (marketProb < 0.4 && researchNotes.length > 0) {
              researchAlignment = 'supported';
            }
            break;
          }
        }
      }

      // Fallback: keyword matching if no LLM-matched insights
      if (!hasResearchContext) {
        const researchText = `${research.summary || ''} ${(research.bull_case || []).join(' ')} ${(research.bear_case || []).join(' ')}`.toLowerCase();
        const keywords = marketTitle.split(/\s+/).filter(w => w.length > 3);
        hasResearchContext = keywords.some(kw => researchText.includes(kw));

        if (hasResearchContext) {
          // Market is mentioned in research - extract relevant insights
          if (marketProb > 0.6) {
            // High probability market - check if research supports
            const bullMentions = (research.bull_case || []).filter(point => 
              keywords.some(kw => point.toLowerCase().includes(kw))
            );
            if (bullMentions.length > 0) {
              researchAlignment = 'supported';
              researchNotes = bullMentions;
            }
          } else if (marketProb < 0.4) {
            // Low probability market - check if research supports
            const bearMentions = (research.bear_case || []).filter(point => 
              keywords.some(kw => point.toLowerCase().includes(kw))
            );
            if (bearMentions.length > 0) {
              researchAlignment = 'supported';
              researchNotes = bearMentions;
            }
          }
        }
      }

      return {
        ...market,
        marketProb,
        researchAlignment,
        researchNotes,
        hasResearchContext
      };
    });
  }, [markets, research]);

  // Sort markets: those with research context first, then by volume
  const sortedMarkets = useMemo(() => {
    return [...enhancedMarkets].sort((a, b) => {
      // Prioritize markets with research context
      if (a.hasResearchContext && !b.hasResearchContext) return -1;
      if (!a.hasResearchContext && b.hasResearchContext) return 1;
      // Then by volume
      return (b.volume_total || 0) - (a.volume_total || 0);
    });
  }, [enhancedMarkets]);

  const toggleMarket = (marketId) => {
    const newExpanded = new Set(expandedMarkets);
    if (newExpanded.has(marketId)) {
      newExpanded.delete(marketId);
    } else {
      newExpanded.add(marketId);
    }
    setExpandedMarkets(newExpanded);
  };

  // Calculate aggregate stats
  const aggregateStats = useMemo(() => {
    if (!markets.length) return null;

    let totalVol = 0;
    let weightedProbSum = 0;
    let count = 0;

    markets.forEach(m => {
      let prob = 0.5;
      if (m.outcomePrices) {
        try {
          const prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : m.outcomePrices;
          prob = parseFloat(prices[0]) || 0.5;
        } catch (e) {}
      }
      const vol = parseFloat(m.volume_total || 0);
      totalVol += vol;
      if (vol > 0) weightedProbSum += (prob * vol);
      count++;
    });

    return {
      consensusProb: totalVol > 0 ? weightedProbSum / totalVol : 0,
      totalVol,
      marketCount: count
    };
  }, [markets]);

  return (
    <div className="unified-analysis">
      {/* Header with aggregate stats and research confidence */}
      <div className="unified-header">
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Markets Found</span>
            <span className="stat-value">{markets.length}</span>
          </div>
          {aggregateStats && (
            <>
              <div className="stat-item">
                <span className="stat-label">Consensus Probability</span>
                <span className="stat-value">
                  {(aggregateStats.consensusProb * 100).toFixed(1)}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Volume</span>
                <span className="stat-value">
                  ${(aggregateStats.totalVol / 1000).toFixed(0)}K
                </span>
              </div>
            </>
          )}
          {research && (
            <div className="stat-item research-confidence">
              <span className="stat-label">Research Confidence</span>
              <span className={`stat-value confidence-${research.web_confidence || 'medium'}`}>
                {research.web_confidence || 'medium'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Research Summary (if available) - Compact */}
      {research && research.summary && (
        <div className="research-context">
          <div className="research-context-header">
            <h3>Research Context</h3>
            <button 
              className="toggle-sources"
              onClick={() => setShowSources(!showSources)}
            >
              {showSources ? 'Hide' : 'Show'} Sources ({research.sources?.length || 0})
            </button>
          </div>
          <div className="research-summary-text">
            {research.summary.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Key Events - Compact */}
          {research.key_events && research.key_events.length > 0 && (
            <div className="key-events-compact">
              <Calendar size={16} />
              <div className="events-list-compact">
                {research.key_events.slice(0, 3).map((event, i) => (
                  <span key={i} className="event-tag">{event}</span>
                ))}
                {research.key_events.length > 3 && (
                  <span className="event-tag more">+{research.key_events.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Sources - Collapsible */}
          {showSources && research.sources && research.sources.length > 0 && (
            <div className="sources-compact">
              {research.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link-compact"
                >
                  <span className="source-index">{i + 1}</span>
                  <span className="source-title-compact">{source.title}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Markets with Research Integration */}
      <div className="markets-container">
        {sortedMarkets.map((market, index) => {
          const isExpanded = expandedMarkets.has(market.id);
          const hasResearch = market.hasResearchContext && market.researchNotes.length > 0;

          return (
            <div 
              key={market.id || index} 
              className={`market-card-enhanced ${hasResearch ? 'has-research' : ''} ${market.researchAlignment}`}
            >
              <div className="market-card-main">
                <MarketCard market={market} />
                
                {/* Research Indicator */}
                {hasResearch && (
                  <div className="research-indicator">
                    <AlertCircle size={14} />
                    <span>Research context available</span>
                  </div>
                )}

                {/* Expand/Collapse Button */}
                {(hasResearch || research) && (
                  <button
                    className="expand-button"
                    onClick={() => toggleMarket(market.id)}
                  >
                    {isExpanded ? (
                      <>
                        <span>Hide Research Context</span>
                        <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        <span>Show Research Context</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Expanded Research Context */}
              {isExpanded && research && (
                <div className="market-research-context">
                  {/* Market-specific research notes */}
                  {market.researchNotes.length > 0 && (
                    <div className="market-research-notes">
                      <h4>Relevant Research Insights</h4>
                      <ul>
                        {market.researchNotes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bull/Bear Case (if relevant to this market) */}
                  {(research.bull_case?.length > 0 || research.bear_case?.length > 0) && (
                    <div className="market-bull-bear">
                      {research.bull_case && research.bull_case.length > 0 && (
                        <div className="bull-case-compact">
                          <TrendingUp size={16} />
                          <div>
                            <strong>Supporting Factors</strong>
                            <ul>
                              {research.bull_case.slice(0, 3).map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {research.bear_case && research.bear_case.length > 0 && (
                        <div className="bear-case-compact">
                          <TrendingDown size={16} />
                          <div>
                            <strong>Contrary Factors</strong>
                            <ul>
                              {research.bear_case.slice(0, 3).map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      {research && (
        <div className="unified-footer">
          <p>
            Research insights are derived from recent web sources and are provided to complement prediction market data. 
            Markets are ranked by research relevance and trading volume.
          </p>
        </div>
      )}
    </div>
  );
}

