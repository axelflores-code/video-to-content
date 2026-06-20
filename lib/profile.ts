// lib/profile.ts
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[profile] Error fetching:", error.message);
    return null;
  }

  return data;
}

export async function saveVoiceProfile(
  description: string,
  sampleCount: number
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      voice_profile_description: description,
      voice_profile_created_at: new Date().toISOString(),
      voice_profile_sample_count: sampleCount,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[profile] Error saving voice profile:", error.message);
    return false;
  }

  return true;
}

export async function clearVoiceProfile(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      voice_profile_description: null,
      voice_profile_created_at: null,
      voice_profile_sample_count: 0,
    })
    .eq("id", user.id);

  return !error;
}