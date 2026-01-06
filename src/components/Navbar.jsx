import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import probableLogo from '../assets/logos/probable.png';
import { useWaitlist } from '../contexts/WaitlistContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <a href="/" className="logo" onClick={handleLogoClick}>
          {!isScrolled && <Shield size={20} className="logo-globe" />}
          <img src={probableLogo} alt="Probable" className="logo-icon" />
        </a>
        <div className="nav-links">
          <Link to="/" className="nav-link-product">
            Product
          </Link>
          <Link to="/support">Support</Link>
          <Link to="/manifesto">Manifesto</Link>
        </div>
        <div className="nav-actions">
          <button 
            className={`btn-login ${isScrolled ? 'scrolled' : ''}`}
            onClick={openWaitlist}
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </nav>
  );
}