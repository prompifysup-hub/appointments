/*
 * Minimal client for Prompify's data proxy, configured at runtime by /env-config.js
 * (window.__PROMPIFY_CONFIG). Used by src/calendar/requests.ts.
 */
type PrompifyConfig = { apiUrl?: string; chatId?: string; token?: string };

declare global {
  interface Window {
    __PROMPIFY_CONFIG?: PrompifyConfig;
  }
}

const config = (): PrompifyConfig => window.__PROMPIFY_CONFIG || {};

/** False when the app runs outside Prompify (local preview): the calendar then uses its demo data. */
export const isConnected = () => Boolean(config().apiUrl && config().chatId);

async function request<T>(table: string, init: RequestInit = {}, query = ""): Promise<T> {
  const cfg = config();
  const res = await fetch(`${cfg.apiUrl}/${cfg.chatId}/${table}${query}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.token ?? ""}`,
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || `Request failed (HTTP ${res.status})`);
  return body.data as T;
}

export const db = {
  list: <T>(table: string) => request<T[]>(table, {}, "?limit=1000"),
  create: <T>(table: string, values: Record<string, unknown>) =>
    request<T>(table, { method: "POST", body: JSON.stringify(values) }),
  update: <T>(table: string, id: string, values: Record<string, unknown>) =>
    request<T>(table, { method: "PATCH", body: JSON.stringify(values) }, `?id=${encodeURIComponent(id)}`),
  remove: (table: string, id: string) => request(table, { method: "DELETE" }, `?id=${encodeURIComponent(id)}`),
};
