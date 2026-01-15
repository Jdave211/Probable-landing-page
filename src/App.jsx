import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Support from './pages/Support';
import Manifesto from './pages/Manifesto';
import { WaitlistProvider, useWaitlist } from './contexts/WaitlistContext';
import './App.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './lib/analytics';

const WaitlistModal = lazy(() => import('./components/WaitlistModal'));

function RouteAnalytics() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

function WaitlistModalHost() {
  const { isWaitlistOpen, closeWaitlist } = useWaitlist();
  return (
    <Suspense fallback={null}>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={closeWaitlist} />
    </Suspense>
  );
}

function AppShell() {
  const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
  
  return (
    <div className="app">
      <RouteAnalytics />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/support" element={<Support />} />
        <Route path="/manifesto" element={<Manifesto />} />
      </Routes>
      <WaitlistModalHost />
    
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="copyright">© 2025 Probable Inc.</span>
          </div>
          <div className="footer-links">
            <a href={`${productUrl}/pricing`}>Terms</a>
            <a href={`${productUrl}/pricing`}>Privacy</a>
            <a href="#">Status</a>
            <a href="#">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WaitlistProvider>
      <AppShell />
    </WaitlistProvider>
  );
}

export default App;
