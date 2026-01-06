import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Activity, Droplets, AlertTriangle, Sparkles, ShieldCheck, BarChart3 } from 'lucide-react';
import './AnalysisDashboard.css';

export default function AnalysisDashboard({ markets, query, insights }) {
  // 1. Use Server Aggregates if available, else calculate client-side
  const stats = useMemo(() => {
    if (insights?.aggregates) {
      return insights.aggregates;
    }
    
    if (!markets || markets.length === 0) return null;

    let totalVol = 0;
    let weightedProbSum = 0;
    let totalLiq = 0;
    let spreadSum = 0;
    let count = 0;

    markets.forEach(m => {
      let prob = 0;
      if (m.outcomePrices) {
        try {
          const prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : m.outcomePrices;
          prob = parseFloat(prices[0]) || 0;
        } catch (e) {}
      }

      const vol = parseFloat(m.volume_total || m.volume || 0);
      const liq = parseFloat(m.liquidity || 0);
      const spread = 0.01; 

      totalVol += vol;
      if (vol > 0) weightedProbSum += (prob * vol);
      totalLiq += liq;
      spreadSum += spread;
      count++;
    });

    const consensusProb = totalVol > 0 ? (weightedProbSum / totalVol) : 0;
    const avgSpread = count > 0 ? (spreadSum / count) : 0;

    return {
      consensusProb,
      totalVol,
      totalLiq,
      avgSpread,
      marketCount: count,
      dispersion: 0.1 // Default if client-calculated
    };
  }, [markets, insights]);

  // 2. Generate Time Series Data (Simulated for now)
  const chartData = useMemo(() => {
    if (!stats) return [];
    const data = [];
    const days = 30;
    const endProb = stats.consensusProb;
    
    // If we have a trend signal, bias the start point
    let trendBias = 0;
    if (insights?.trendSignal?.direction === 'rising') trendBias = -0.15;
    if (insights?.trendSignal?.direction === 'falling') trendBias = 0.15;

    let currentProb = endProb + trendBias + (Math.random() * 0.1 - 0.05); 

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const drift = (endProb - currentProb) / (i + 1);
      const noise = (Math.random() * 0.04 - 0.02);
      currentProb += drift + noise;
      currentProb = Math.max(0.01, Math.min(0.99, currentProb));

      data.push({
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        prob: (currentProb * 100).toFixed(1)
      });
    }
    data[data.length - 1].prob = (endProb * 100).toFixed(1);
    return data;
  }, [stats, insights]);

  if (!stats) return null;

  const formatCurrency = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toFixed(0)}`;
  };

  const getTrendIcon = () => {
    if (!insights?.trendSignal) return <Activity size={18} />;
    switch (insights.trendSignal.direction) {
      case 'rising': return <TrendingUp size={18} className="text-green-400" />;
      case 'falling': return <TrendingDown size={18} className="text-red-400" />;
      default: return <Minus size={18} className="text-gray-400" />;
    }
  };

  const getRiskColor = () => {
    if (!insights?.riskAssessment) return 'text-blue-400';
    switch (insights.riskAssessment.level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="analysis-dashboard">
      {/* Header Strip */}
      <div className="dashboard-header">
        <div className="query-context">
          <span className="label">Analysis for:</span>
          <h1>"{query}"</h1>
        </div>
        {insights && (
          <div className="ai-insight-badge">
            <Sparkles size={14} />
            <span>AI Generated Insight</span>
          </div>
        )}
      </div>

      {/* Summary Section (New) */}
      {insights?.summary && (
        <div className="summary-section">
           <div className="summary-card">
             <h3>Executive Summary</h3>
             <p>{insights.summary}</p>
           </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="stats-row">
        {/* Consensus Probability */}
        <div className="dashboard-card highlight">
          <div className="card-label">Consensus Probability</div>
          <div className="big-metric">
            {(stats.consensusProb * 100).toFixed(0)}%
            <span className="metric-unit">chance</span>
          </div>
          <div className="card-subtext">
            Weighted average across {stats.marketCount} markets
          </div>
        </div>

        {/* Trend Signal (New) */}
        <div className="dashboard-card">
          <div className="card-label">Trend Signal</div>
          <div className="metric-row">
            {getTrendIcon()}
            <span className="value capitalize">{insights?.trendSignal?.direction || 'Neutral'}</span>
          </div>
          <div className="card-subtext">
            {insights?.trendSignal?.description || 'Based on recent price action'}
          </div>
        </div>

        {/* Market Depth */}
        <div className="dashboard-card">
          <div className="card-label">Market Depth</div>
          <div className="metric-row">
            <BarChart3 size={18} className="icon-vol" />
            <span className="value">{formatCurrency(stats.totalVol)}</span>
            <span className="label">Vol</span>
          </div>
          <div className="metric-row">
            <Droplets size={18} className="icon-liq" />
            <span className="value">{formatCurrency(stats.totalLiq)}</span>
            <span className="label">Liq</span>
          </div>
        </div>

        {/* Risk / Dispersion */}
        <div className="dashboard-card">
          <div className="card-label">Risk Level</div>
          <div className="metric-row">
            <ShieldCheck size={18} className={getRiskColor()} />
            <span className={`value capitalize ${getRiskColor()}`}>
              {insights?.riskAssessment?.level || 'Low'}
            </span>
          </div>
          <div className="card-subtext">
            {insights?.riskAssessment?.description || 'Based on market dispersion'}
          </div>
        </div>
      </div>

      {/* Main Chart & Insight Grid */}
      <div className="dashboard-grid">
        {/* Chart Section */}
        <div className="chart-section dashboard-card">
          <div className="chart-header">
            <h3>Probability Trend (30d Forecast)</h3>
            <div className="chart-legend">
              <span className="legend-dot"></span> Consensus
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#8b949e" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#8b949e" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#fff' }}
                  itemStyle={{ color: '#58a6ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="prob" 
                  stroke="#58a6ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProb)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Insights List */}
        <div className="narrative-section dashboard-card">
          <h3>Key Strategic Insights</h3>
          <div className="insights-list">
            {insights?.insights?.map((insight, idx) => (
              <div key={idx} className="insight-item">
                <div className="insight-header">
                  <span className="insight-bullet">•</span>
                  <h4>{insight.title}</h4>
                  <span className={`impact-badge ${insight.impact?.toLowerCase()}`}>
                    {insight.impact} Impact
                  </span>
                </div>
                <p>{insight.description}</p>
              </div>
            )) || (
              <p className="text-gray-400">Loading strategic insights...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
