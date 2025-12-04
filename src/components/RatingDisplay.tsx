import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export const RatingDisplay = ({
  rating,
  totalRatings = 0,
  size = "md",
  showCount = true,
}: RatingDisplayProps) => {
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
  );
};
