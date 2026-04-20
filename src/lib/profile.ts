// Lightweight client-side profile store for the mock auth flow.
// Persists the contact + business name captured at signup or onboarding
// so the dashboard can render the user's own info instead of placeholder data.

export const PROFILE_STORAGE_KEY = "ema:profile";

export interface StoredProfile {
  contactName?: string;
  businessName?: string;
  email?: string;
}

export function readProfile(): StoredProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredProfile;
    return {
      contactName: typeof parsed.contactName === "string" ? parsed.contactName : undefined,
      businessName: typeof parsed.businessName === "string" ? parsed.businessName : undefined,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
    };
  } catch {
    return {};
  }
}

export function saveProfile(patch: StoredProfile) {
  if (typeof window === "undefined") return;
  try {
    const current = readProfile();
    const merged: StoredProfile = { ...current };
    if (typeof patch.contactName === "string" && patch.contactName.trim()) {
      merged.contactName = patch.contactName.trim();
    }
    if (typeof patch.businessName === "string" && patch.businessName.trim()) {
      merged.businessName = patch.businessName.trim();
    }
    if (typeof patch.email === "string" && patch.email.trim()) {
      merged.email = patch.email.trim();
    }
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore quota / serialization errors — sidebar will fall back to defaults
  }
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getInitials(name?: string, fallback = "U") {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
