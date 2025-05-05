
import { ContentScores, PromptType } from "@/types/filtering";

// Simple keyword-based scoring system (would be ML-based in a real system)
const toxicityKeywords = ["harmful", "dangerous", "offensive", "hateful", "violent", "toxic"];
const biasKeywords = ["always", "never", "all", "none", "only", "every", "nobody"];
const offensivenessKeywords = ["stupid", "dumb", "idiot", "loser", "hate", "terrible"];

// All problematic words combined for highlighting
export const allProblematicWords = [
  ...toxicityKeywords,
  ...biasKeywords,
  ...offensivenessKeywords
];

/**
 * Scores content based on toxicity, bias, and offensiveness
 * @param content The text content to score
 * @returns Content scores with values from 0-100
 */
export const scoreContent = (content: string): ContentScores => {
  const lowercase = content.toLowerCase();
  
  // Count keyword matches for each category
  const toxicityMatches = toxicityKeywords.filter(keyword => 
    lowercase.includes(keyword)).length;
  const biasMatches = biasKeywords.filter(keyword => 
    lowercase.includes(keyword)).length;
  const offensivenessMatches = offensivenessKeywords.filter(keyword => 
    lowercase.includes(keyword)).length;
  
  // Calculate scores (0-100 scale)
  const toxicity = Math.min(100, (toxicityMatches / toxicityKeywords.length) * 100);
  const bias = Math.min(100, (biasMatches / biasKeywords.length) * 100);
  const offensiveness = Math.min(100, (offensivenessMatches / offensivenessKeywords.length) * 100);
  
  // Calculate weighted overall score (toxicity weighs more)
  const overall = Math.min(100, (toxicity * 0.5) + (bias * 0.2) + (offensiveness * 0.3));
  
  return {
    toxicity,
    bias,
    offensiveness,
    overall
  };
};

/**
 * Find harmful words in a text and return their positions
 * @param content The text to analyze
 * @returns Array of found problematic words with their positions
 */
export const findProblematicWords = (content: string): { word: string, index: number }[] => {
  const results: { word: string, index: number }[] = [];
  const contentLower = content.toLowerCase();
  
  allProblematicWords.forEach(word => {
    let startIndex = 0;
    let foundIndex;
    
    while ((foundIndex = contentLower.indexOf(word, startIndex)) !== -1) {
      results.push({ 
        word, 
        index: foundIndex 
      });
      startIndex = foundIndex + word.length;
    }
  });
  
  // Sort by position in text
  return results.sort((a, b) => a.index - b.index);
};

/**
 * Get severity level based on overall score
 */
export const getSeverityFromScore = (score: number): "low" | "medium" | "high" | "critical" => {
  if (score < 25) return "low";
  if (score < 50) return "medium";
  if (score < 75) return "high";
  return "critical";
};

/**
 * Get recommended action based on severity
 */
export const getActionFromSeverity = (
  severity: "low" | "medium" | "high" | "critical"
): "allow" | "flag" | "modify" | "block" => {
  switch (severity) {
    case "low": return "allow";
    case "medium": return "flag";
    case "high": return "modify";
    case "critical": return "block";
  }
};

/**
 * Get content type based on overall score
 */
export const getPromptTypeFromScore = (score: number): PromptType => {
  if (score < 30) return "neutral";
  if (score < 70) return "borderline";
  return "harmful";
};
