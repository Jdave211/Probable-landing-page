/**
 * Lead capture API service (waitlist + demo requests).
 * Uses Vite proxy in dev: /api/* -> http://localhost:3001/api/*
 * In production, set VITE_API_URL=https://...
 */

let API_BASE = import.meta.env.VITE_API_URL || '';

// Prevent double /api prefix issue
if (API_BASE.endsWith('/api')) {
  API_BASE = API_BASE.slice(0, -4);
}

async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || data?.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return await res.json();
}

export function submitWaitlistLead(payload) {
  return postJson('/api/leads/waitlist', payload);
}

export function submitDemoRequest(payload) {
  return postJson('/api/leads/demo-request', payload);
}


