// Tracks the last few dashboard paths the user visited. Pure client-side —
// drives the "Recent" group inside the global Command Palette.

const STORAGE_KEY = "isola.recentPaths";
const MAX = 5;

export type RecentPath = {
  path: string;
  /** Best-effort label for display (page title or last segment). */
  label: string;
  visitedAt: number;
};

export function readRecentPaths(): RecentPath[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is RecentPath =>
      x && typeof x.path === "string" && typeof x.label === "string",
    );
  } catch {
    return [];
  }
}

export function pushRecentPath(path: string, label: string) {
  if (typeof window === "undefined") return;
  if (!path.startsWith("/dashboard")) return;
  try {
    const prev = readRecentPaths().filter((p) => p.path !== path);
    const next: RecentPath[] = [{ path, label, visitedAt: Date.now() }, ...prev].slice(0, MAX);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("isola:recents-changed"));
  } catch {
    // ignore quota
  }
}
