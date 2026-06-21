/**
 * keepAlive.js
 *
 * Pings the backend every 14 minutes to prevent Render's free-tier server
 * from spinning down due to inactivity (Render idles after 15 min).
 *
 * Call `startKeepAlive()` once at app startup and it runs for the entire
 * browser session.  Call `stopKeepAlive()` if you ever need to cancel it.
 */

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'https://taskmanager-q1cr.onrender.com';

const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

let intervalId = null;

async function ping() {
  try {
    const res = await fetch(`${BACKEND_URL}/ping`, { method: 'GET' });
    if (res.ok) {
      console.log('[KeepAlive] Server is awake ✓', new Date().toLocaleTimeString());
    } else {
      console.warn('[KeepAlive] Ping returned non-OK status:', res.status);
    }
  } catch (err) {
    console.warn('[KeepAlive] Ping failed:', err.message);
  }
}

/**
 * Start the keep-alive pinger.
 * Fires an immediate ping, then repeats every 14 minutes.
 */
export function startKeepAlive() {
  if (intervalId !== null) return; // already running

  // Fire immediately so the server is warm before the user tries to log in
  ping();

  intervalId = setInterval(ping, PING_INTERVAL_MS);
  console.log('[KeepAlive] Started – pinging every 14 minutes.');
}

/**
 * Stop the keep-alive pinger (optional cleanup).
 */
export function stopKeepAlive() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[KeepAlive] Stopped.');
  }
}
