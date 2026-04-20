import { useEffect, useState, useCallback } from "react";

export interface OdooMeta {
  url?: string;
  database?: string;
  version?: string;
  customers?: number;
  products?: number;
  openInvoices?: number;
  lastSync?: string; // ISO
}

export interface OdooConnectionState {
  connected: boolean;
  meta: OdooMeta;
}

const FLAG_KEY = "odooConnected";
const META_KEY = "isola.odoo.meta";
const EVENT = "isola:odoo-changed";

function readState(): OdooConnectionState {
  if (typeof window === "undefined") return { connected: false, meta: {} };
  const connected = window.localStorage.getItem(FLAG_KEY) === "true";
  let meta: OdooMeta = {};
  try {
    const raw = window.localStorage.getItem(META_KEY);
    if (raw) meta = JSON.parse(raw) as OdooMeta;
  } catch {
    // ignore
  }
  return { connected, meta };
}

export function writeOdooState(connected: boolean, meta: OdooMeta = {}) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FLAG_KEY, connected ? "true" : "false");
  if (connected) {
    window.localStorage.setItem(META_KEY, JSON.stringify({ ...meta, lastSync: new Date().toISOString() }));
  } else {
    window.localStorage.removeItem(META_KEY);
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useOdooConnection() {
  // Start as null to avoid SSR/hydration mismatch — consumers can show loading.
  const [state, setState] = useState<OdooConnectionState | null>(null);

  useEffect(() => {
    setState(readState());
    const refresh = () => setState(readState());
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const setConnected = useCallback((connected: boolean, meta?: OdooMeta) => {
    writeOdooState(connected, meta ?? {});
  }, []);

  return {
    connected: state?.connected ?? null,
    meta: state?.meta ?? {},
    setConnected,
  };
}

// Keyword triggers — anything Ema can't answer without Odoo
const ODOO_KEYWORDS = [
  "invoice", "invoicing", "bill", "payment received", "mark paid", "outstanding",
  "inventory", "stock", "86", "reorder", "low stock",
  "p&l", "profit", "loss", "monthly sales", "revenue", "bank", "cash",
  "customer record", "partner", "crm",
  "expense", "approve", "reject",
  "supplier", "purchase order", " po ",
];

export function requiresOdoo(message: string): boolean {
  const m = ` ${message.toLowerCase()} `;
  return ODOO_KEYWORDS.some((k) => m.includes(k));
}
