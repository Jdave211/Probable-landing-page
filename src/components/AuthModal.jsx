import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import probableLogo from '../assets/logos/probable.png';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Reset mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccess(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNeedsConfirmation(false);
    }
  }, [isOpen, initialMode]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      
      if (data.session) {
        const { access_token, refresh_token } = data.session;
        // Check for redirect parameter
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect');
        
        if (redirectUrl) {
          // Redirect to the original product app URL
          window.location.href = redirectUrl;
        } else {
          // Default: redirect to product app
          const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
          window.location.href = `${productUrl}/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}`;
        }
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // If not yet confirmed, show password confirmation
    if (!needsConfirmation) {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      const hasLetter = /[A-Za-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (password.length < 8 || !hasLetter || !hasNumber) {
        setError('Password must be at least 8 characters, containing letters & digits');
        return;
      }
      setNeedsConfirmation(true);
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password);
      if (error) throw error;

      if (data.user && !data.session) {
        setSuccess(true);
      } else if (data.session) {
        // If session is created immediately, redirect to product app
        const { access_token, refresh_token } = data.session;
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect');
        
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
          window.location.href = `${productUrl}/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}`;
        }
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    // Store redirect URL in sessionStorage for OAuth callback
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    if (redirectUrl) {
      sessionStorage.setItem('auth_redirect', redirectUrl);
    }
    
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    } else {
      // OAuth redirect will happen
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNeedsConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-logo">
            <img src={probableLogo} alt="Probable" className="logo-icon" />
          </div>
          <h1>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>
            {mode === 'signin' 
              ? "Sign in to keep exploring the future"
              : "Sign up to start exploring the future"
            }
          </p>
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
            <span>Check your email to confirm your account before signing in.</span>
          </div>
        )}

        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={needsConfirmation}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-group-header">
              <label htmlFor="password">Password</label>
              {mode === 'signin' && (
                <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); }}>
                  Forgot password?
                </a>
              )}
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                minLength={mode === 'signup' ? 8 : undefined}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                disabled={needsConfirmation}
              />
            </div>
            {mode === 'signup' && !needsConfirmation && (
              <small>Must be at least 8 characters, containing letters & digits</small>
            )}
          </div>

          {mode === 'signup' && needsConfirmation && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  autoFocus
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading 
              ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...')
              : (mode === 'signin' ? 'Sign In' : (needsConfirmation ? 'Create Account' : 'Continue'))
            }
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          type="button" 
          className="auth-button google"
          onClick={handleGoogleSignIn}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-footer">
          <p>
            {mode === 'signin' ? (
              <>Don't have an account? <button type="button" className="auth-link-button" onClick={switchMode}>Create one</button></>
            ) : (
              <>Already have an account? <button type="button" className="auth-link-button" onClick={switchMode}>Sign In</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

