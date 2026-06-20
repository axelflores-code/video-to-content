// lib/voiceProfile.ts
const STORAGE_KEY = "vtc_voice_profile";

export interface VoiceProfile {
  description: string; // El párrafo que devuelve la IA
  createdAt: string;
  sampleCount: number;
}

export function getVoiceProfile(): VoiceProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveVoiceProfile(profile: VoiceProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearVoiceProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}