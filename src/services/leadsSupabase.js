import { supabase } from '../lib/supabase';

export async function submitWaitlistToSupabase({
  name,
  email,
  profession,
  audience,
  useCases = [],
  source = 'client_waitlist_modal',
}) {
  const { error } = await supabase.from('waitlist').insert({
    name,
    email,
    profession,
    audience,
    use_cases: useCases,
    source,
  });

  if (error) throw error;
  return { ok: true };
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


