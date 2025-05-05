
export type PromptType = "neutral" | "borderline" | "harmful";

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
}
