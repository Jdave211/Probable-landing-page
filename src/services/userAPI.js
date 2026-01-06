const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function syncUserProfile(supabaseUser) {
  if (!supabaseUser) return null;
  const payload = {
    supabaseUserId: supabaseUser.id,
    email: supabaseUser.email,
    displayName:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      null,
  };

  const res = await fetch(`${API_BASE}/users/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('Failed to sync user profile', await res.text());
    return null;
  }

  const data = await res.json();
  return data.user;
}

export async function completeOnboarding({ supabaseUser, userType, onboardingData }) {
  if (!supabaseUser) return null;

  const payload = {
    supabaseUserId: supabaseUser.id,
    email: supabaseUser.email,
    userType,
    onboardingData,
  };

  const res = await fetch(`${API_BASE}/users/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('Failed to complete onboarding', await res.text());
    return null;
  }

  const data = await res.json();
  return data.user;
}


