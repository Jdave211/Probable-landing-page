import { useState, useRef, useEffect } from 'react';
import { Check, X, Info } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showFootnotes, setShowFootnotes] = useState(false);
  const footnotesRef = useRef(null);

  // Scroll to footnotes when they're toggled on
  useEffect(() => {
    if (showFootnotes && footnotesRef.current) {
      setTimeout(() => {
        footnotesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [showFootnotes]);

  const handleToggleFootnotes = () => {
    setShowFootnotes(!showFootnotes);
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1 className="pricing-title">
          Simple, Transparent Pricing
          <button 
            className="footnote-indicator"
            onClick={handleToggleFootnotes}
            aria-label="Toggle feature details"
            title="Click for detailed feature explanations"
          >
            <Info size={20} />
          </button>
        </h1>
        <p className="pricing-subtitle">Choose the plan that fits your market intelligence needs.</p>
        
        <div className="pricing-toggle-container">
          <span className={`toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
          <button 
            className={`pricing-toggle ${isAnnual ? 'annual' : ''}`}
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle pricing period"
          >
            <div className="toggle-thumb" />
          </button>
          <span className={`toggle-label ${isAnnual ? 'active' : ''}`}>
            Yearly <span className="save-badge">Save 25%</span>
          </span>
        </div>
      </div>

      <div className="pricing-cards">
        {/* Free Plan */}
        <div className="pricing-card free">
          <div className="card-header">
            <h3>Free Plan</h3>
            <p>Get Started</p>
          </div>
          <div className="card-price">
            <span className="amount">$0</span>
            <span className="period">/month</span>
          </div>
          <div className="price-subtext">
            Basic Access
          </div>
          <ul className="card-features">
            <li><Check size={18} /> Basic market search</li>
            <li><Check size={18} /> Prediction markets sentiment only</li>
            <li><Check size={18} /> Full access to chat mode </li>
            <li><Check size={18} /> Standard support</li>
            <li className="disabled"><X size={18} /> Advanced analysis with deep research & web intelligence</li>
            <li className="disabled"><X size={18} /> Historical markets access</li>
            <li className="disabled"><X size={18} /> Analysis Dashboard</li>
          </ul>
          <button 
            className="btn-pricing secondary" 
            onClick={() => {
              const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
              window.location.href = `${productUrl}?auth=signup`;
            }}
          >
            Try Probable for free
          </button>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card pro popular">
          <div className="popular-badge">Most Popular</div>
          <div className="card-header">
            <h3>Pro Plan</h3>
            <p>Everything you need to move with confidence</p>
          </div>
          <div className="card-price">
            <span className="amount">${isAnnual ? '15' : '20'}</span>
            <span className="period">/month</span>
          </div>
          <div className="price-subtext">
            {isAnnual ? 'Billed annually at $180/year' : 'Billed monthly'}
          </div>
          <ul className="card-features">
            <li><Check size={18} /> Unlimited research</li>
            <li><Check size={18} /> Full access to analysis dashboard</li>
            <li><Check size={18} /> Full market depth & liquidity</li>
            <li><Check size={18} /> Deep research & web intelligence</li>
            <li><Check size={18} /> Real-time odds & price tracking</li>
            <li><Check size={18} /> Historical markets access</li>
          </ul>
          <button 
            className="btn-pricing primary" 
            onClick={() => {
              const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
              window.location.href = `${productUrl}?auth=signup`;
            }}
          >
            Start 7 Day Free Trial
          </button>
        </div>

        {/* Lifetime Plan */}
        <div className="pricing-card lifetime">
          <div className="card-header">
            <h3>Lifetime</h3>
            <p>Full access forever</p>
          </div>
          <div className="card-price">
            <span className="amount">$349</span>
            <span className="period">one-time</span>
          </div>
          <div className="price-subtext">
            Limited to first 200 users
          </div>
          <ul className="card-features">
            <li><Check size={18} /> Everything in Pro, forever</li>
            <li><Check size={18} /> Priority support</li>
            <li><Check size={18} /> Early access to beta features</li>
            <li><Check size={18} /> Custom feature requests for enterprise</li>
          </ul>
          <button 
            className="btn-pricing primary" 
            onClick={() => {
              const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
              window.location.href = `${productUrl}?auth=signup`;
            }}
          >
            Get Lifetime Access
          </button>
        </div>
      </div>

      {/* Feature Details Footnotes */}
      {showFootnotes && (
      <div className="pricing-footnotes" ref={footnotesRef}>
        <h3 className="footnotes-title">Feature Details</h3>
        
        <div className="footnote-section">
          <h4 className="footnote-plan">Free Plan</h4>
          <ul className="footnote-list">
            <li>
              <strong>Basic market search:</strong> Search prediction markets with standard keyword matching. 
              Returns top 10 most relevant markets based on your query.
            </li>
            <li>
              <strong>Prediction markets sentiment only:</strong> Analysis based solely on prediction market data 
              (odds, volume, liquidity). No external web research or additional intelligence sources.
            </li>
            <li>
              <strong>Full access to chat mode:</strong> Interactive chat interface to ask questions and get 
              instant responses. All chat functionality available, but limited to basic market sentiment analysis.
            </li>
            <li>
              <strong>Standard support:</strong> Email support with typical response times. Community resources 
              and documentation access.
            </li>
          </ul>
        </div>

        <div className="footnote-section">
          <h4 className="footnote-plan">Pro Plan</h4>
          <ul className="footnote-list">
            <li>
              <strong>Unlimited research:</strong> No daily or monthly limits on searches, queries, or research requests. 
              Conduct as many analyses as needed.
            </li>
            <li>
              <strong>Full access to analysis dashboard:</strong> Complete access to the advanced dashboard with 
              interactive charts, market statistics, trend analysis, and comprehensive market insights visualization.
            </li>
            <li>
              <strong>Full market depth & liquidity:</strong> Access to complete order book data, bid/ask spreads, 
              market depth charts, and detailed liquidity metrics for informed decision-making.
            </li>
            <li>
              <strong>Deep research & web intelligence:</strong> AI-powered research that combines prediction market 
              data with real-time web intelligence, expert analysis, news sources, and contextual information to 
              provide comprehensive market insights beyond just odds.
            </li>
            <li>
              <strong>Real-time odds & price tracking:</strong> Live updates on market prices, odds changes, and 
              probability shifts as they happen. Track market movements in real-time.
            </li>
            <li>
              <strong>Historical markets access:</strong> Browse and analyze past markets, view historical odds 
              movements, and access archived market data for trend analysis and pattern recognition.
            </li>
          </ul>
        </div>

        <div className="footnote-section">
          <h4 className="footnote-plan">Lifetime Plan</h4>
          <ul className="footnote-list">
            <li>
              <strong>Everything in Pro, forever:</strong> All Pro plan features included permanently. No recurring 
              fees, no subscription renewals. One-time payment for lifetime access to all current and future Pro features.
            </li>
            <li>
              <strong>Priority support:</strong> Expedited support with faster response times, dedicated support channel, 
              and priority handling of issues and requests.
            </li>
            <li>
              <strong>Early access to beta features:</strong> Get first access to new features, experimental tools, 
              and beta releases before they're available to other users. Help shape the product with early feedback.
            </li>
            <li>
              <strong>Custom feature requests for enterprise:</strong> Submit custom feature requests tailored to your 
              specific needs. Enterprise-level customization options and direct input into product development roadmap.
            </li>
          </ul>
        </div>
      </div>
      )}
    </div>
  );
}
