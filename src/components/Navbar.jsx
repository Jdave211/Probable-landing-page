import { useState, useEffect, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import probableLogo from '../assets/logos/probable.png';
import { useWaitlist } from '../contexts/WaitlistContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <a href="/" className="logo" onClick={handleLogoClick}>
            {!isScrolled && <Shield size={20} className="logo-globe" />}
            <img src={probableLogo} alt="Probable" className="logo-icon" />
          </a>
          
          {/* Desktop nav links */}
          <div className="nav-links desktop-only">
            <Link to="/" className="nav-link-product">
              Product
            </Link>
            <Link to="/support">Support</Link>
            <Link to="/manifesto">Manifesto</Link>
          </div>
          
          <div className="nav-actions">
            {/* Desktop Join Waitlist button */}
            <button 
              className={`btn-login desktop-only ${isScrolled ? 'scrolled' : ''}`}
              onClick={openWaitlist}
            >
              Join Waitlist
            </button>
            
            {/* Mobile burger menu */}
            <button 
              className="mobile-menu-toggle mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-panel" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
              Product
            </Link>
            <Link to="/support" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
              Support
            </Link>
            <Link to="/manifesto" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
              Manifesto
            </Link>
            <button 
              className="btn-login mobile-menu-cta"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openWaitlist();
              }}
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(Navbar);