// lib/usage.ts
import { createClient } from "@/lib/supabase/client";

const FREE_DAILY_LIMIT = 3;

export async function getTodayUsageCount(): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("generations_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfDay.toISOString());

  if (error) {
    console.error("[usage] Error counting:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function canGenerate(isPremium: boolean): Promise<{ allowed: boolean; remaining: number }> {
  if (isPremium) return { allowed: true, remaining: Infinity };

  const used = await getTodayUsageCount();
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return { allowed: remaining > 0, remaining };
}

export async function logGeneration(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("generations_log")
    .insert({ user_id: user.id });

  if (error) {
    console.error("[usage] Error logging:", error.message);
  }
}

export { FREE_DAILY_LIMIT };