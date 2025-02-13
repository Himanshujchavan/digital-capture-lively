
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DigitDisplayProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  hasAnomaly?: boolean;
}

export const DigitDisplay = ({ value, className, style, hasAnomaly }: DigitDisplayProps) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div
      className={cn(
        "relative w-16 h-24 bg-display-background rounded-lg backdrop-blur-sm border overflow-hidden shadow-lg transition-all duration-300",
        hasAnomaly ? "border-red-500/50 shadow-red-500/20" : "border-display-border",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-4xl font-bold text-white transition-all duration-300",
          isAnimating && "animate-number-spin",
          hasAnomaly && "text-red-200"
        )}
      >
        {value}
      </div>
      <div className={cn(
        "absolute inset-0 bg-display-glow opacity-20 pointer-events-none",
        hasAnomaly && "bg-red-500/10"
      )} />
      {hasAnomaly && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};
