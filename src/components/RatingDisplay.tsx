import { Star, Award, Trophy, Medal, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RatingDisplayProps {
  rating: number;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  showBadges?: boolean;
}

const getBadges = (rating: number, totalRatings: number) => {
  const badges = [];

  if (totalRatings >= 50) {
    badges.push({
      icon: Trophy,
      label: "Veterano",
      color: "text-yellow-500",
      description: "50+ transportes avaliados",
    });
  } else if (totalRatings >= 20) {
    badges.push({
      icon: Medal,
      label: "Experiente",
      color: "text-amber-500",
      description: "20+ transportes avaliados",
    });
  } else if (totalRatings >= 10) {
    badges.push({
      icon: Award,
      label: "Confiável",
      color: "text-orange-500",
      description: "10+ transportes avaliados",
    });
  }

  if (rating >= 4.8 && totalRatings >= 5) {
    badges.push({
      icon: Star,
      label: "Top Rated",
      color: "text-yellow-400",
      description: "Avaliação média 4.8+",
    });
  }

  if (rating >= 4.5 && totalRatings >= 10) {
    badges.push({
      icon: Shield,
      label: "Premium",
      color: "text-blue-500",
      description: "Excelência consistente",
    });
  }

  if (totalRatings >= 5 && rating >= 4.0) {
    badges.push({
      icon: Zap,
      label: "Verificado",
      color: "text-green-500",
      description: "Transportador verificado",
    });
  }

  return badges;
};

export const RatingDisplay = ({
  rating,
  totalRatings = 0,
  size = "md",
  showCount = true,
  showBadges = false,
}: RatingDisplayProps) => {
  const badges = getBadges(rating, totalRatings);
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${sizeClasses[size]} ${
                star <= Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        {showCount && (
          <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
            {rating > 0 ? rating.toFixed(1) : "N/A"}
            {totalRatings > 0 && ` (${totalRatings})`}
          </span>
        )}
      </div>
      
      {showBadges && badges.length > 0 && (
        <TooltipProvider>
          <div className="flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Badge variant="outline" className="gap-1 px-2 py-0.5">
                    <badge.icon className={`w-3 h-3 ${badge.color}`} />
                    <span className="text-xs">{badge.label}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};
