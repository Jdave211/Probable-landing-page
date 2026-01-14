import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Briefcase, Check, CheckCircle, GraduationCap, LineChart, Mail, User } from 'lucide-react';
import probableLogo from '../assets/logos/probable.png';
import { submitWaitlistToSupabase } from '../services/leadsSupabase';
import { trackEvent } from '../lib/analytics';
import './AuthModal.css';

export default function WaitlistModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [audience, setAudience] = useState(''); // individual | small_business
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const professionOptions = useMemo(
    () => [
      { id: 'professional', label: 'Professional', icon: <Briefcase size={20} />, hint: 'Working in an industry' },
      { id: 'student', label: 'Student', icon: <GraduationCap size={20} />, hint: 'Learning & exploring' },
      { id: 'analyst', label: 'Analyst / Researcher', icon: <LineChart size={20} />, hint: 'Tracking signals & probabilities' },
      { id: 'other', label: 'Other', icon: <User size={20} />, hint: 'Tell us in the notes later' },
    ],
    []
  );

  const useCaseOptions = useMemo(
    () => [
      { id: 'hedging', label: 'Hedge risk exposure' },
      { id: 'forecasting', label: 'Forecast outcomes' },
      { id: 'decision_intel', label: 'Decision intelligence' },
      { id: 'alerts', label: 'Alerts when odds move' },
      { id: 'research', label: 'Research & analysis' },
      { id: 'trading', label: 'Trading ideas' },
      { id: 'planning', label: 'Scenario planning' },
    ],
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setEmail('');
    setProfession('');
    setAudience('');
    setUseCases([]);
    setLoading(false);
    setError('');
    setSuccess(false);
  }, [isOpen]);

  const toggleUseCase = (id) => {
    setUseCases((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!profession) {
      setError('Please select a profession');
      return;
    }
    if (!audience) {
      setError('Please select Individual or Small business');
      return;
    }

    setLoading(true);
    try {
      await submitWaitlistToSupabase({
        name: name.trim(),
        email: email.trim(),
        profession,
        audience,
        useCases,
        source: 'client_waitlist_modal',
      });
      setSuccess(true);
      trackEvent('waitlist_submit_success', {
        placement: 'waitlist_modal',
        profession,
        audience,
        use_cases_count: Array.isArray(useCases) ? useCases.length : 0,
      });

      // Give a tiny moment for the success state to render, then close.
      setTimeout(() => {
        onClose?.();
      }, 450);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
      trackEvent('waitlist_submit_error', {
        placement: 'waitlist_modal',
        message: String(err?.message || 'unknown'),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-logo">
            <img src={probableLogo} alt="Probable" className="logo-icon" />
          </div>
          <h1>Join the Waitlist</h1>
          <p>Tell us a bit about you — we’ll tailor onboarding and reach out as we open access.</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <CheckCircle size={16} />
            <span>You're on the list. We'll be in touch soon.</span>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="wl-name">Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="wl-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="wl-email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="wl-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profession</label>
              <div className="onboarding-pill-row vertical">
                {professionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`onboarding-card ${profession === opt.id ? 'selected' : ''}`}
                    onClick={() => setProfession(opt.id)}
                  >
                    {opt.icon}
                    <div className="onboarding-card-text">
                      <strong>{opt.label}</strong>
                      <span>{opt.hint}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>I’m using Probable as a…</label>
              <div className="onboarding-pill-row">
                <button
                  type="button"
                  className={`onboarding-pill ${audience === 'individual' ? 'selected' : ''}`}
                  onClick={() => setAudience('individual')}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`onboarding-pill ${audience === 'small_business' ? 'selected' : ''}`}
                  onClick={() => setAudience('small_business')}
                >
                  Small business
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>What would you use it for?</label>
              <div className="onboarding-pill-row">
                {useCaseOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`onboarding-pill ${useCases.includes(opt.id) ? 'selected' : ''}`}
                    onClick={() => toggleUseCase(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-button primary" disabled={loading}>
              {loading ? 'Sending…' : 'Join Waitlist'}
            </button>

            <button type="button" className="auth-button google" onClick={onClose}>
              Not now
            </button>
          </form>
        ) : (
          <div className="auth-form">
            <button type="button" className="auth-button primary" onClick={onClose}>
              <Check size={16} style={{ marginRight: 8 }} />
              Joined
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


