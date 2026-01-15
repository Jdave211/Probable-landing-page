// Lightweight GA4 analytics (optional).
// Enabled only when VITE_GA_MEASUREMENT_ID is set.

import { insertAnalyticsEvents } from "../services/analyticsSupabase";

const STORAGE_KEY = "probable_utm_v1";
const SESSION_KEY = "probable_session_id_v1";

let queue = [];
let flushTimer = null;
let lastPageView = { path: null, at: 0 };

function getSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      `sid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `sid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }
}

function getUtmFromUrl() {
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const utm = {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_term: params.get("utm_term") || undefined,
      utm_content: params.get("utm_content") || undefined,
    };
    // If none present, return null
    if (!Object.values(utm).some(Boolean)) return null;
    return utm;
  } catch {
    return null;
  }
}

function loadPersistedUtm() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUtm(utm) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...utm, captured_at: Date.now() }));
  } catch {
    // ignore
  }
}

export function getAttributionParams() {
  const persisted = loadPersistedUtm();
  if (persisted) {
    const { captured_at, ...rest } = persisted;
    return rest;
  }
  return {};
}

export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  // Capture UTM once per user/session (best-effort)
  const utm = getUtmFromUrl();
  if (utm) persistUtm(utm);

  // Still initialize Supabase logging even if GA4 is disabled.
  // (No additional setup needed here.)
  if (!measurementId) return { enabled: false };

  // Inject gtag script
  if (!document.querySelector('script[data-ga4="gtag"]')) {
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    s1.setAttribute("data-ga4", "gtag");
    document.head.appendChild(s1);
  }

  // Setup dataLayer + gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
    ...getAttributionParams(),
  });

  return { enabled: true, measurementId };
}

async function flushQueue() {
  if (queue.length === 0) return;
  const batch = queue;
  queue = [];
  try {
    await insertAnalyticsEvents(batch);
  } catch {
    // swallow analytics failures (never break UX)
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = window.setTimeout(async () => {
    flushTimer = null;
    await flushQueue();
  }, 1500);
}

export function trackEvent(name, params = {}) {
  // Supabase logging (best-effort, batched)
  try {
    const session_id = getSessionId();
    const pathname = typeof window !== "undefined" ? window.location.pathname : undefined;
    const referrer = typeof document !== "undefined" ? document.referrer : undefined;
    const user_agent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
    const utm = getAttributionParams();

    queue.push({
      session_id,
      event_name: name,
      pathname,
      referrer,
      user_agent,
      utm: Object.keys(utm).length ? utm : null,
      params: params && Object.keys(params).length ? params : null,
    });

    // Flush quickly if a lot of events build up
    if (queue.length >= 10) {
      void flushQueue();
    } else {
      scheduleFlush();
    }
  } catch {
    // ignore
  }

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", name, {
    ...getAttributionParams(),
    ...params,
  });
}

export function trackPageView(pathOverride) {
  const path = pathOverride || (typeof window !== "undefined" ? window.location.pathname : "");
  const now = Date.now();
  // Dev/StrictMode guard: avoid double-firing for the same path in quick succession
  if (lastPageView.path === path && now - lastPageView.at < 1000) return;
  lastPageView = { path, at: now };
  trackEvent("page_view", { path });
}


