import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/signin?error=auth_failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to product
          const { access_token, refresh_token } = data.session;
          const redirectUrl = sessionStorage.getItem('auth_redirect');
          sessionStorage.removeItem('auth_redirect');
          
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            const productUrl = import.meta.env.VITE_PRODUCT_APP_URL || 'http://localhost:5174';
            window.location.href = `${productUrl}/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}`;
          }
        } else {
          // No session found
          navigate('/signin');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/signin?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      color: '#c9d1d9'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>Completing sign in...</div>
        <div style={{ fontSize: '14px', color: '#8b949e' }}>Please wait</div>
      </div>
    </div>
  );
}

