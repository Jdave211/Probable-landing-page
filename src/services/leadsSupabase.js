import { supabase } from '../lib/supabase';

export async function submitWaitlistToSupabase({
  name,
  email,
  profession,
  audience,
  useCases = [],
  source = 'client_waitlist_modal',
}) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  // Prefer upsert to avoid duplicates (requires a unique constraint on email to fully work).
  // If the table doesn't have that constraint, we still handle duplicate errors gracefully.
  const { error } = await supabase.from('waitlist_users').upsert({
    name,
    email: normalizedEmail,
    profession,
    audience,
    use_cases: useCases,
    source,
  }, { onConflict: 'email' });

  // If a unique constraint exists and the user is already present, treat it as success.
  // Postgres unique violation: 23505 (surface varies depending on config).
  if (error) {
    if (error?.code === '23505') return { ok: true, alreadyJoined: true };
    throw error;
  }

  return { ok: true, alreadyJoined: false };
}

export async function submitDemoRequestToSupabase({
  name,
  email,
  company,
  preferredTimes,
  message,
  source = 'client_support_form',
}) {
  const createdAt = new Date().toISOString();

  const { data, error } = await supabase
    .from('demo_requests')
    .insert({
      name,
      email,
      company,
      preferred_times: preferredTimes,
      message,
      source,
    })
    .select('id, created_at')
    .single();

  if (error) throw error;

  // Trigger email (best-effort; don't block success on email failures)
  try {
    await supabase.functions.invoke('send-demo-request', {
      body: {
        requestId: data?.id,
        createdAt: data?.created_at || createdAt,
        name,
        email,
        company,
        preferredTimes,
        message,
        source,
      },
    });
  } catch {
    // ignore
  }

  return { ok: true };
}


