
import { ContentScores as ContentScoresType } from "@/types/filtering";
import { Progress } from "@/components/ui/progress";
import { ThumbsDown, Ban, BatteryWarning } from "lucide-react";

interface ContentScoresProps {
  scores: ContentScoresType | undefined;
  showDetails?: boolean;
}

const ContentScores = ({ scores, showDetails = false }: ContentScoresProps) => {
  if (!scores) return null;
  
  const getScoreColor = (score: number) => {
    if (score < 25) return "bg-green-500";
    if (score < 50) return "bg-amber-500";
    if (score < 75) return "bg-orange-500";
    return "bg-red-500";
  };
  
  const getScoreText = (score: number) => {
    if (score < 25) return "Low";
    if (score < 50) return "Moderate";
    if (score < 75) return "High";
    return "Critical";
  };
  
  const getScoreIcon = (type: keyof ContentScoresType) => {
    const score = scores[type];
    if (type === "toxicity") return <Ban className="h-4 w-4" />;
    if (type === "bias") return <BatteryWarning className="h-4 w-4" />;
    if (type === "offensiveness") return <ThumbsDown className="h-4 w-4" />;
    return null;
  };
  
  return (
    <div className="space-y-4 mt-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Score</span>
          <span className={`text-sm font-bold ${
            getScoreColor(scores.overall).replace("bg-", "text-")
          }`}>
            {getScoreText(scores.overall)} ({Math.round(scores.overall)}%)
          </span>
        </div>
        <Progress value={scores.overall} className={`h-2 ${getScoreColor(scores.overall)}`} />
      </div>
      
      {showDetails && (
        <div className="space-y-3 pt-2 border-t border-slate-700">
          {(Object.keys(scores) as Array<keyof ContentScoresType>)
            .filter(key => key !== "overall")
            .map((key) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getScoreIcon(key)}
                    <span className="text-xs font-medium capitalize">{key}</span>
                  </div>
                  <span className="text-xs">{Math.round(scores[key])}%</span>
                </div>
                <Progress value={scores[key]} className={`h-1 ${getScoreColor(scores[key])}`} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContentScores;
