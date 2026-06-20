// types/database.ts
export interface Profile {
  id: string;
  email: string | null;
  is_premium: boolean;
  voice_profile_description: string | null;
  voice_profile_created_at: string | null;
  voice_profile_sample_count: number;
  created_at: string;
}

export interface GenerationLog {
  id: string;
  user_id: string;
  created_at: string;
}