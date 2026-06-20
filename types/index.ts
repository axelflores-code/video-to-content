export type SocialNetwork = "linkedin" | "instagram" | "twitter";
export type ToneOfVoice = "professional" | "persuasive" | "casual";

export interface GeneratedContent {
  linkedinPost?: string;
  instagramPost?: string;
  twitterPost?: string;
  hooks: string;
}

export interface GenerateRequest {
  url: string;
  networks: SocialNetwork[];
  tone: ToneOfVoice;
}