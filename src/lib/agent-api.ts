// src/lib/agent-api.ts
// ITER-15: client for BFF's /api/internal/agent-settings/[agentId] endpoint.
//
// MVP-only: the internal secret is embedded in the client bundle via a
// VITE_ env var. This is NOT production-safe — anyone with the bundle can
// read/write any agent's settings. Replace with a signed tenant token or
// a server-side TanStack Start proxy when tenant #2 lands.

const BFF_API_URL =
  (import.meta.env.VITE_BFF_API_URL as string | undefined) ?? "https://bff.epic.dm";
const BFF_INTERNAL_SECRET =
  (import.meta.env.VITE_BFF_INTERNAL_SECRET as string | undefined) ?? "";

export const DEFAULT_AGENT_ID =
  (import.meta.env.VITE_DEFAULT_AGENT_ID as string | undefined) ?? "";

export type AgentSettings = {
  id: string;
  name: string;
  ownerPhone: string | null;
  status: string;
  template: string;
  waDisplayNumber: string | null;
  waPhoneNumberId: string | null;
  paperclipAgentId: string | null;
  paperclipCompanyId: string | null;
  welcome: string;
  tone: number;
  signatureLine: string;
  confidenceFloor: number;
  escalationKeywords: string[];
  channels: string[];
  updatedAt: string;
};

export type AgentSettingsPatch = Partial<
  Pick<
    AgentSettings,
    | "name"
    | "ownerPhone"
    | "status"
    | "welcome"
    | "tone"
    | "signatureLine"
    | "confidenceFloor"
    | "escalationKeywords"
    | "channels"
  >
> & {
  status?: string;
};

function assertConfigured() {
  if (!BFF_API_URL || !BFF_INTERNAL_SECRET) {
    throw new Error(
      "BFF API not configured. Set VITE_BFF_API_URL and VITE_BFF_INTERNAL_SECRET in .env.local",
    );
  }
}

export function isAgentApiConfigured(): boolean {
  return Boolean(BFF_API_URL) && Boolean(BFF_INTERNAL_SECRET);
}

export async function fetchAgentSettings(agentId: string): Promise<AgentSettings> {
  assertConfigured();
  const res = await fetch(`${BFF_API_URL}/api/internal/agent-settings/${agentId}`, {
    method: "GET",
    headers: {
      "x-internal-secret": BFF_INTERNAL_SECRET,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Fetch settings failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as AgentSettings;
}

export async function saveAgentSettings(
  agentId: string,
  patch: AgentSettingsPatch,
): Promise<AgentSettings> {
  assertConfigured();
  const res = await fetch(`${BFF_API_URL}/api/internal/agent-settings/${agentId}`, {
    method: "PATCH",
    headers: {
      "x-internal-secret": BFF_INTERNAL_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Save settings failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as AgentSettings;
}
