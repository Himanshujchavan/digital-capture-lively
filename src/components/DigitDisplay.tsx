
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DigitDisplayProps {
  value: number;
  className?: string;
}

export const DigitDisplay = ({ value, className }: DigitDisplayProps) => {
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
        "relative w-16 h-24 bg-display-background rounded-lg backdrop-blur-sm border border-display-border overflow-hidden shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-4xl font-bold text-white transition-all duration-300",
          isAnimating && "animate-number-spin"
        )}
      >
        {value}
      </div>
      <div className="absolute inset-0 bg-display-glow opacity-20 pointer-events-none" />
    </div>
  );
};
