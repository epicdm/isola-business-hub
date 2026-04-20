"use client";

import { useState } from "react";
import { Loader2, Check, Eye, EyeOff, Plug, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type OdooFormValues = { url: string; database: string; apiKey: string };

export type OdooTestResult =
  | { state: "idle" }
  | { state: "testing" }
  | { state: "ok"; version: string; customers: number; products: number }
  | { state: "error"; message: string };

export function evaluateOdoo(d: OdooFormValues): Exclude<OdooTestResult, { state: "idle" } | { state: "testing" }> {
  if (!d.apiKey || d.apiKey.trim().length < 12) {
    return { state: "error", message: "Invalid API key. Generate a new one in Odoo Settings → Users & Companies → Users → API Keys." };
  }
  if (d.url.toLowerCase().includes("invalid")) {
    return { state: "error", message: "Couldn't reach Odoo. Double-check the URL." };
  }
  if (d.database.toLowerCase().includes("wrong")) {
    return { state: "error", message: "Database not found. Check the name in Odoo under Settings → Manage Databases." };
  }
  try { new URL(d.url); } catch { return { state: "error", message: "Couldn't reach Odoo. Double-check the URL." }; }
  return { state: "ok", version: "17.0", customers: 247, products: 1832 };
}

interface Props {
  values: OdooFormValues;
  onChange: (next: OdooFormValues) => void;
  result: OdooTestResult;
  onTest: () => void;
  onResetResult: () => void;
}

export default function OdooConnectionForm({ values, onChange, result, onTest, onResetResult }: Props) {
  const [showKey, setShowKey] = useState(false);
  const isOk = result.state === "ok";
  const isTesting = result.state === "testing";
  const isError = result.state === "error";

  const handle = <K extends keyof OdooFormValues>(k: K, v: string) => {
    onChange({ ...values, [k]: v });
    if (result.state !== "idle") onResetResult();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="o-url">Odoo URL</Label>
        <Input id="o-url" type="url" placeholder="https://coalpot.odoo.com" value={values.url} onChange={(e) => handle("url", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="o-db">Database name</Label>
        <Input id="o-db" placeholder="coalpot-prod" value={values.database} onChange={(e) => handle("database", e.target.value)} />
        <p className="text-[11px] text-muted-foreground">Find this in Odoo under <span className="font-mono">Settings → Manage Databases</span>.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="o-key">API key</Label>
        <div className="relative">
          <Input
            id="o-key"
            type={showKey ? "text" : "password"}
            placeholder="••••••••••••••••"
            className="pr-10 font-mono"
            value={values.apiKey}
            onChange={(e) => handle("apiKey", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="button"
        onClick={onTest}
        disabled={isTesting || isOk}
        className={cn("w-full", isOk && "bg-success text-success-foreground hover:bg-success/90")}
      >
        {isTesting && (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Testing…</>)}
        {isOk && (<><Check className="mr-2 h-4 w-4" />Connected · Odoo {result.version}</>)}
        {!isTesting && !isOk && (<><Plug className="mr-2 h-4 w-4" />Test connection</>)}
      </Button>

      {isOk && (
        <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-xs text-foreground">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-success" />
          <span>
            Detected <span className="font-semibold">{result.customers.toLocaleString()} customers</span> and{" "}
            <span className="font-semibold">{result.products.toLocaleString()} products</span>.
          </span>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-medium">{result.message}</p>
        </div>
      )}
    </div>
  );
}
