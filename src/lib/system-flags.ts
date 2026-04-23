// System-wide UI flags that live in localStorage. Currently:
//   - DnD ("pause all agents") — dims presence, status bar shows DND state.
//
// Each flag emits a same-tab event so listeners can react without a full
// reload. Cross-tab sync happens via the native `storage` event.

export const DND_KEY = "isola.dnd";
export const DND_EVENT = "isola:dnd-changed";

export function readDnd(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DND_KEY) === "1";
  } catch {
    return false;
  }
}

export function setDnd(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DND_KEY, on ? "1" : "0");
    window.dispatchEvent(new Event(DND_EVENT));
  } catch {
    // ignore
  }
}

export function toggleDnd(): boolean {
  const next = !readDnd();
  setDnd(next);
  return next;
}
