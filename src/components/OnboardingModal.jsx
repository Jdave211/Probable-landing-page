import { useEffect, useState } from 'react';
import { User, Briefcase, GraduationCap, TrendingUp, PieChart } from 'lucide-react';
import probableLogo from '../assets/logos/probable.png';
import './AuthModal.css';

/**
 * Multi-step onboarding modal.
 * Step 1: Welcome + Name
 * Step 2: User Type
 * -> Transitions to TutorialOverlay
 */
export default function OnboardingModal({ isOpen, onStartTutorial, initialName = '' }) {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(initialName);
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialName) setDisplayName(initialName);
  }, [initialName]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!displayName.trim()) {
        setError('Please enter your name to continue');
        return;
      }
      setStep(2);
      setError('');
    } else if (step === 2) {
      if (!userType) {
        setError('Please select an option');
        return;
      }
      onStartTutorial({ displayName, userType });
    }
  };

  return (
    <div className="auth-modal-overlay"> {/* Removed onClick to close */}
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-logo">
            <img src={probableLogo} alt="Probable" className="logo-icon" />
          </div>
          
          {step === 1 ? (
            <>
              <h1>Welcome to Probable</h1>
              <p>Let's take a chance on the future together.</p>
            </>
          ) : (
            <>
              <h1>Tell us about yourself</h1>
              <p>We'll tailor your experience based on your goals.</p>
            </>
          )}
        </div>

        {error && (
          <div className="auth-alert error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-form">
          {step === 1 && (
            <div className="form-group">
              <label htmlFor="displayName">What should we call you?</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-group">
              <label>I am primarily a...</label>
              <div className="onboarding-pill-row vertical">
                <button
                  type="button"
                  className={`onboarding-card ${userType === 'trader' ? 'selected' : ''}`}
                  onClick={() => setUserType('trader')}
                >
                  <TrendingUp size={20} />
                  <div className="onboarding-card-text">
                    <strong>Trader</strong>
                    <span>Looking for market opportunities & alpha</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`onboarding-card ${userType === 'researcher' ? 'selected' : ''}`}
                  onClick={() => setUserType('researcher')}
                >
                  <PieChart size={20} />
                  <div className="onboarding-card-text">
                    <strong>Researcher / Analyst</strong>
                    <span>Deep diving into data & trends</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`onboarding-card ${userType === 'manager' ? 'selected' : ''}`}
                  onClick={() => setUserType('manager')}
                >
                  <Briefcase size={20} />
                  <div className="onboarding-card-text">
                    <strong>Business / Strategy</strong>
                    <span>Making informed decisions</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`onboarding-card ${userType === 'student' ? 'selected' : ''}`}
                  onClick={() => setUserType('student')}
                >
                  <GraduationCap size={20} />
                  <div className="onboarding-card-text">
                    <strong>Student</strong>
                    <span>Learning about prediction markets</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          <button type="button" className="auth-button primary" onClick={handleNext}>
            {step === 1 ? 'Continue' : 'Start Tour'}
          </button>
        </div>
      </div>
    </div>
  );
}
