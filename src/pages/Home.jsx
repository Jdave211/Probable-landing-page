import { useMemo, useState, useEffect, lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Zap, Target, Sparkles, ChevronRight, ArrowRight, Globe, BarChart3, Shield, Brain, LineChart, User, Bot } from 'lucide-react';
import MarketCard from '../components/MarketCard';
import { FlipWords } from '../components/ui/FlipWords';
import { useWaitlist } from '../contexts/WaitlistContext';
import { LampContainer } from '../components/ui/Lamp';
import { ShootingStars } from '../components/ui/ShootingStars';
import { StarsBackground } from '../components/ui/StarsBackground';
import './Home.css';

// Lazy-load heavy below-the-fold components
const MacbookScroll = lazy(() =>
  import('../components/ui/macbook-scroll').then((m) => ({ default: m.MacbookScroll }))
);
const CardStack = lazy(() =>
  import('../components/ui/CardStack').then((m) => ({ default: m.CardStack }))
);
const WorldMap = lazy(() =>
  import('../components/ui/world-map').then((m) => ({ default: m.WorldMap }))
);

// Logo imports - using logos from main assets folder
import cibcLogo from '../assets/logos/cibc.png';
import jpmorganLogo from '../assets/logos/jpmorgan.png';
import amazonLogo from '../assets/logos/amazon.png';
import scotiabankLogo from '../assets/logos/scotiabank.png';
import googleLogo from '../assets/logos/google.png';
import uberLogo from '../assets/logos/uber.png';
import waterlooLogo from '../assets/logos/uw.png';
import bellLogo from '../assets/logos/bell.png';
import carletonLogo from '../assets/logos/carleton.png';
import doordashLogo from '../assets/logos/doordash.png';
import netflixLogo from '../assets/logos/netflix.png';
import uoftLogo from '../assets/logos/uoft.png';
import yorkLogo from '../assets/logos/yorku.png';
import rbcLogo from '../assets/logos/rbc.png';
import bmoLogo from '../assets/logos/bmo.png';
import osuLogo from '../assets/logos/osu.png';
import citiLogo from '../assets/logos/citi.png';

// User persona imports
import analystImg from '../assets/users/analyst.png';
import tradersImg from '../assets/users/traders.png';
import investorsImg from '../assets/users/investors.png';
import foundersImg from '../assets/users/founders.png';
import economistsImg from '../assets/users/economists.png';
import researchersImg from '../assets/users/researchers.png';

// Hedge card imports
import hedge1Img from '../assets/hedges/hedge1.png';
import hedge2Img from '../assets/hedges/hedge2.png';
import hedge3Img from '../assets/hedges/hedge3.png';
import hedge4Img from '../assets/hedges/hedge4.png';

// Chat demo image
import chatImg from '../assets/chat.png';

// Static data moved outside component for better performance
const LOGO_ITEMS = [
  { logo: cibcLogo, alt: 'CIBC' },
  { logo: jpmorganLogo, alt: 'JPMorgan' },
  { logo: amazonLogo, alt: 'Amazon' },
  { logo: scotiabankLogo, alt: 'Scotiabank' },
  { logo: googleLogo, alt: 'Google' },
  { logo: waterlooLogo, alt: 'University of Waterloo' },
  { logo: uoftLogo, alt: 'University of Toronto' },
  { logo: uberLogo, alt: 'Uber' },
  { logo: yorkLogo, alt: 'York University' },
  { logo: bellLogo, alt: 'Bell' },
  { logo: carletonLogo, alt: 'Carleton University' },
  { logo: doordashLogo, alt: 'DoorDash' },
  { logo: netflixLogo, alt: 'Netflix' },
  { logo: rbcLogo, alt: 'RBC' },
  { logo: bmoLogo, alt: 'BMO' },
  { logo: osuLogo, alt: 'OSU' },
  { logo: citiLogo, alt: 'Citi' },
];

// Duplicate for seamless loop
const ALL_LOGOS = [...LOGO_ITEMS, ...LOGO_ITEMS];

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [currentWord, setCurrentWord] = useState(0);
  const { openWaitlist } = useWaitlist();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const CALENDLY_URL =
    'https://calendly.com/founders-joinprobable/30min?month=2026-01&date=2026-01-17';
  // lightweight analytics
  // (no-op unless VITE_GA_MEASUREMENT_ID is set)

  const words = ['predict', 'hedge', 'understand', 'forecast'];

  // Detect mobile for performance optimizations (throttled)
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150);
    };
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle hash navigation on mount
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1); // Remove the # symbol
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Redirect to product app with query parameter
    const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
    window.location.href = `${productUrl}/chat?q=${encodeURIComponent(query)}`;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Mock data for the "Action" section
  const demoMarket = {
    id: 'demo-1',
    title: 'Will the Fed cut interest rates in December 2025?',
    question: 'Will the Fed cut interest rates in December 2025?',
    platform: 'polymarket',
    volume_total: 73367336,
    outcomePrices: JSON.stringify([0.04, 0.96]),
    outcomes: JSON.stringify(['Yes', 'No']),
    end_time: new Date('2025-12-10').getTime() / 1000,
    slug: 'fed-increases-interest-rates-by-25-bps-after-december-2025-meeting',
    category: 'MONETARY_POLICY',
    subcategory: 'FEDERAL_RESERVE',
    llm_tags: JSON.stringify(['Federal Reserve', 'Rate Hike', 'FOMC'])
  };

  // Hedging cards data (memoized so CardStack doesn't reset on re-renders)
  const hedgingCards = useMemo(
    () => [
      { id: 1, image: hedge1Img },
      { id: 2, image: hedge2Img },
      { id: 3, image: hedge3Img },
      { id: 4, image: hedge4Img },
    ],
    []
  );

  return (
    <div className="home-page relative w-full overflow-hidden bg-slate-950">
      {/* Hide expensive background animations on mobile for better performance */}
      {!isMobile && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ShootingStars />
          <StarsBackground />
        </div>
      )}

      {/* Hero Section */}
      <LampContainer className="hero-section">
        <div className="hero-content relative z-50 flex flex-col items-center justify-center">
          <h1 className="hero-title text-center">
            <FlipWords 
              words={["Predict", "Hedge", "Forecast", "Trade"]} 
              className="text-white"
            /> <br />
            the future
          </h1>
          <p className="hero-subtitle text-center mt-4">
          Forecast outcomes, hedge risk, and decide with confidence—powered by the real-time truth of prediction markets.
          </p>

          <div className="hero-cta mt-8">
            <button className="btn-primary" onClick={() => {
              openWaitlist();
            }}>
              Join Waitlist
            </button>
            <a
              className="btn-secondary"
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                // defer import to keep initial bundle identical
                import('../lib/analytics').then(({ trackEvent }) =>
                  trackEvent('schedule_demo_click', { placement: 'hero' })
                );
              }}
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </LampContainer>

      {/* How It Works Section */}
      <section className="how-it-works relative z-10" id="how-it-works">
        <div className="how-it-works-wrapper">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">
              How Probable Works
            </h2>
            <p className="how-it-works-subtitle">
              We find prediction markets that have the highest possibility to affect you, or your business—and leverage a decision intelligence layer to figure out what you should do to either hedge to reduce risk exposure, or make better decisions based on hard probabilities.
            </p>
          </div>

          <div className="how-it-works-content">
            {/* MacBook Scroll Demo */}
            <Suspense fallback={<div style={{ height: 520 }} />}>
              <MacbookScroll
                src="https://www.youtube.com/embed/aBkb_wY4yKs?autoplay=1&mute=1&loop=1&playlist=aBkb_wY4yKs"
                showGradient={false}
                showTitle={false}
              />
            </Suspense>

            {/* Sticky Notes (How it works) */}
            <div className="sticky-notes-container">
              <div className="sticky-note sticky-note-1">
                <div className="sticky-tape" />
                <div className="sticky-kicker">
                  <Search size={16} /> Signal
                </div>
                <h3 className="sticky-title">What could hit us next?</h3>
                <ul className="sticky-list">
                  <li>Find markets likely to affect you (industry + macro + policy)</li>
                  <li>Rank by impact × probability</li>
                  <li>Save a watchlist for the next 30/60/90 days</li>
                </ul>
                <div className="sticky-footer">Less noise. More signal.</div>
              </div>

              <div className="sticky-note sticky-note-2">
                <div className="sticky-tape" />
                <div className="sticky-kicker">
                  <Brain size={16} /> Meaning
                </div>
                <h3 className="sticky-title">Why are the odds moving?</h3>
                <ul className="sticky-list">
                  <li>Summarize the drivers behind the move</li>
                  <li>Show what would change the probability next</li>
                  <li>Highlight disagreements (signal vs hype)</li>
                </ul>
                <div className="sticky-footer">Understand the “why”.</div>
              </div>

              <div className="sticky-note sticky-note-3">
                <div className="sticky-tape" />
                <div className="sticky-kicker">
                  <Shield size={16} /> Action
                </div>
                <h3 className="sticky-title">What should we do about it?</h3>
                <ul className="sticky-list">
                  <li>Turn probabilities into decision options</li>
                  <li>Hedge to reduce risk exposure (or lean in)</li>
                  <li>Get alerts when odds cross your threshold</li>
                </ul>
                <div className="sticky-footer">Act with hard probabilities.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses Probable Section */}
      <section className="who-uses-section">
        <div className="who-uses-wrapper">
          <div className="who-uses-header">
            <h2 className="who-uses-title">
              Built for <span className="title-gradient">Every Decision Maker</span>
            </h2>
            <p className="who-uses-subtitle">
              From traders to researchers, Probable helps you make better decisions with real-time prediction market data.
            </p>
          </div>

          <div className="user-personas-grid">
            <div className="personas-scroll-track">
              <div className="persona-card">
                <img src={analystImg} alt="Analysts" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={tradersImg} alt="Traders" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={investorsImg} alt="Investors" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={foundersImg} alt="Founders" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={economistsImg} alt="Economists" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={researchersImg} alt="Researchers" className="persona-image" loading="lazy" />
              </div>
              {/* Duplicate for seamless loop */}
              <div className="persona-card">
                <img src={analystImg} alt="Analysts" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={tradersImg} alt="Traders" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={investorsImg} alt="Investors" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={foundersImg} alt="Founders" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={economistsImg} alt="Economists" className="persona-image" loading="lazy" />
              </div>
              <div className="persona-card">
                <img src={researchersImg} alt="Researchers" className="persona-image" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hedging Section */}
      <section className="hedging-section">

        <div className="hedging-wrapper">
          <div className="hedging-header">
            <h2 className="hedging-title">
              <span className="flip-word-wrapper" style={{ display: 'inline-block', minWidth: '150px', textAlign: 'left' }}>
                <FlipWords 
                  words={["Hedge", "Manage", "Offset"]} 
                  className="text-white inline-block"
                />
              </span>{" "}
              Your{" "}
              <span className="flip-word-wrapper" style={{ display: 'inline-block', minWidth: '200px', textAlign: 'left' }}>
                <FlipWords 
                  words={["Risk", "Exposure", "Volatility"]} 
                  className="title-gradient inline-block"
                />
              </span>
              <br />
              with Prediction Markets
            </h2>
            <p className="hedging-subtitle">
              Small businesses and individuals can use prediction markets to reduce exposure to price volatility,
              economic shifts, and market uncertainty. Turn market intelligence into financial protection.
            </p>
          </div>

          <div className="hedging-examples">
            {isMobile ? (
              <div style={{ display: 'grid', gap: '16px', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                {hedgingCards.map((card) => (
                  <img 
                    key={card.id} 
                    src={card.image} 
                    alt={`Hedging example ${card.id}`}
                    style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <Suspense fallback={<div style={{ height: 520 }} />}>
                <CardStack items={hedgingCards} offset={20} scaleFactor={0.06} />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by-section">
        <div className="section-header">
          <p className="trusted-by-label">
            Valued by <span className="label-highlight label-analysts">Analysts</span>, <span className="label-highlight label-researchers">Researchers</span> & <span className="label-highlight label-decision-makers">Decision Makers</span> at
          </p>
        </div>
        <div className="logo-scroll-container">
          <div className="logo-scroll">
            {ALL_LOGOS.map((item, index) => (
              <div key={index} className="logo-item">
                <img src={item.logo} alt={item.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Demo Section */}
      <section className="chat-demo-section">
        <div className="chat-demo-wrapper">
          <div className="chat-demo-card">
            <div className="chat-demo-header">
              <h2 className="chat-demo-title">
                One powerful model for <br />
                <span className="title-gradient">all your prediction needs</span>
              </h2>
              <p className="chat-demo-description">
                The model understands what you’re trying to hedge or decide—and pulls the right markets with clean probabilities.
                <br /><br />
                You get outputs in a workbench format: hedge suggestions, forecast ranges, scenario paths, and alerts when odds cross your thresholds.
              </p>
            </div>
            
            <div className="chat-demo-interface">
              <div className="chat-demo-image-frame">
                <img
                  src={chatImg}
                  alt="Probable chat example"
                  loading="lazy"
                  className="chat-demo-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Coverage Section */}
      <section className="global-section">
        <div className="global-wrapper">
          <div className="global-header">
            <h2 className="global-title">
              The world moves fast. <span className="title-gradient">So should you.</span>
            </h2>
            <p className="global-subtitle">
              Probable watches global signals—policy, rates, geopolitics, supply chains—and turns them into hard probabilities you can act on.
              <br />
              One place to understand what’s likely next… and what to do about it.
            </p>
          </div>

          {/* Hide WorldMap on mobile for performance */}
          {!isMobile && (
            <div className="global-map-container">
              <Suspense fallback={<div style={{ height: 520 }} />}>
                <WorldMap
                  dots={[
                  // North America ↔ Europe
                  {
                    start: { lat: 40.7128, lng: -74.0060, label: "NY" }, // North America
                    end: { lat: 51.5074, lng: -0.1278, label: "London" }, // Europe
                  },
                  // Europe ↔ Africa
                  {
                    start: { lat: 51.5074, lng: -0.1278, label: "London" }, // Europe
                    end: { lat: 6.5244, lng: 3.3792, label: "Lagos" }, // Africa
                  },
                  // Europe ↔ Asia
                  {
                    start: { lat: 51.5074, lng: -0.1278, label: "London" }, // Europe
                    end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, // Asia
                  },
                  // Asia ↔ Asia (SE Asia)
                  {
                    start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, // Asia
                    end: { lat: 1.3521, lng: 103.8198, label: "Singapore" }, // Asia
                  },
                  // Asia ↔ Australia
                  {
                    start: { lat: 1.3521, lng: 103.8198, label: "Singapore" }, // Asia
                    end: { lat: -33.8688, lng: 151.2093, label: "Sydney" }, // Australia
                  },
                  // North America ↔ South America
                  {
                    start: { lat: 40.7128, lng: -74.0060, label: "NY" }, // North America
                    end: { lat: -23.5505, lng: -46.6333, label: "Sao Paulo" }, // South America
                  },
                  // Australia ↔ Antarctica
                  {
                    start: { lat: -33.8688, lng: 151.2093, label: "Sydney" }, // Australia
                    end: { lat: -77.8419, lng: 166.6863, label: "Antarctica" }, // Antarctica
                  },
                ]}
                lineColor="#0ea5e9"
              />
            </Suspense>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default memo(Home);