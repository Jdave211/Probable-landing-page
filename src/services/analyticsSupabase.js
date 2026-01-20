import { supabase } from "../lib/supabase";

/**
 * Best-effort analytics logging to Supabase.
 * RLS must allow INSERT on public.analytics_events.
 */
export async function insertAnalyticsEvents(events) {
  if (!Array.isArray(events) || events.length === 0) return { ok: true };
  const { error } = await supabase.from("analytics_events").insert(events);
  if (error) throw error;
  return { ok: true };
}






