
// Define the allowed prompt types for content filtering
export type PromptType = "neutral" | "borderline" | "harmful";

export interface ContentScores {
  toxicity: number;     // 0-100 score
  bias: number;         // 0-100 score
  offensiveness: number; // 0-100 score
  overall: number;      // weighted average of all scores
}

export interface ContentFilterResult {
  severity: "low" | "medium" | "high" | "critical";
  categories: {
    hateSpeech: number;
    violence: number;
    selfHarm: number;
    sexual: number;
    harassment: number;
  };
  action: "allow" | "flag" | "modify" | "block";
  scores?: ContentScores; // New property for detailed scoring
}
