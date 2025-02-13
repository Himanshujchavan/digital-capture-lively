
import { useCallback, useEffect, useState } from "react";
import { DisplayGroup } from "./DisplayGroup";

const TOTAL_GROUPS = 3;
const DIGITS_PER_GROUP = 4;

export const DisplaySimulator = () => {
  const [displayValues, setDisplayValues] = useState<number[][]>(
    Array(TOTAL_GROUPS).fill(Array(DIGITS_PER_GROUP).fill(0))
  );

  const generateRandomDigit = useCallback(() => {
    return Math.floor(Math.random() * 10);
  }, []);

  const updateRandomDigit = useCallback(() => {
    const groupIndex = Math.floor(Math.random() * TOTAL_GROUPS);
    const digitIndex = Math.floor(Math.random() * DIGITS_PER_GROUP);
    const newValue = generateRandomDigit();

    setDisplayValues((prev) =>
      prev.map((group, gIdx) =>
        gIdx === groupIndex
          ? group.map((digit, dIdx) =>
              dIdx === digitIndex ? newValue : digit
            )
          : group
      )
    );
  }, [generateRandomDigit]);

  useEffect(() => {
    const interval = setInterval(updateRandomDigit, 1000);
    return () => clearInterval(interval);
  }, [updateRandomDigit]);

  return (
    <div className="flex flex-col space-y-8 p-8">
      {displayValues.map((group, index) => (
        <DisplayGroup key={index} values={group} groupIndex={index} />
      ))}
    </div>
  );
};
