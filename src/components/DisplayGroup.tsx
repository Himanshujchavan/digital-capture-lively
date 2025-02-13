
import { DigitDisplay } from "./DigitDisplay";

interface DisplayGroupProps {
  values: number[];
  groupIndex: number;
}

export const DisplayGroup = ({ values, groupIndex }: DisplayGroupProps) => {
  return (
    <div className="flex space-x-4 p-6 bg-black/5 rounded-2xl backdrop-blur-xl border border-white/10 animate-fade-in">
      <div className="absolute -top-3 left-4 px-2 py-1 bg-black/20 rounded-full text-xs text-white/60">
        Group {groupIndex + 1}
      </div>
      {values.map((value, index) => (
        <DigitDisplay
          key={index}
          value={value}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};
