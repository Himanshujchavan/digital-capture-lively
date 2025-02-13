
import { useCallback, useEffect, useState, useRef } from "react";
import { DisplayGroup } from "./DisplayGroup";
import { AnomalyDetector, AnomalyReport } from "@/utils/anomalyDetector";
import { useToast } from "@/components/ui/use-toast";

const TOTAL_GROUPS = 3;
const DIGITS_PER_GROUP = 4;

export const DisplaySimulator = () => {
  const { toast } = useToast();
  const [displayValues, setDisplayValues] = useState<number[][]>(
    Array(TOTAL_GROUPS).fill(Array(DIGITS_PER_GROUP).fill(0))
  );
  const [anomalies, setAnomalies] = useState<Set<number>>(new Set());
  const detectorRef = useRef<AnomalyDetector>();

  useEffect(() => {
    detectorRef.current = new AnomalyDetector((anomaly: AnomalyReport) => {
      if (anomaly.position !== undefined) {
        setAnomalies(prev => new Set([...prev, anomaly.position]));
        toast({
          title: "Anomaly Detected",
          description: anomaly.description,
          variant: anomaly.severity === 'high' ? 'destructive' : 'default',
        });
        
        // Emit anomaly event
        window.dispatchEvent(new CustomEvent('anomaly-detected', {
          detail: {
            timestamp: anomaly.timestamp,
            position: anomaly.position,
            value: displayValues[Math.floor(anomaly.position / DIGITS_PER_GROUP)]?.[anomaly.position % DIGITS_PER_GROUP],
            type: 'anomaly',
            description: anomaly.description
          }
        }));
        
        setTimeout(() => {
          setAnomalies(prev => {
            const next = new Set(prev);
            next.delete(anomaly.position!);
            return next;
          });
        }, 3000);
      }
    });
  }, [toast, displayValues]);

  const generateRandomDigit = useCallback(() => {
    return Math.floor(Math.random() * 10);
  }, []);

  const updateRandomDigit = useCallback(() => {
    const groupIndex = Math.floor(Math.random() * TOTAL_GROUPS);
    const digitIndex = Math.floor(Math.random() * DIGITS_PER_GROUP);
    const newValue = generateRandomDigit();
    const position = groupIndex * DIGITS_PER_GROUP + digitIndex;

    detectorRef.current?.addChange(position, newValue);

    // Emit number update event
    window.dispatchEvent(new CustomEvent('number-update', {
      detail: {
        timestamp: Date.now(),
        position,
        value: newValue,
        type: 'normal'
      }
    }));

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
      {displayValues.map((group, groupIndex) => (
        <DisplayGroup
          key={groupIndex}
          values={group}
          groupIndex={groupIndex}
          anomalies={Array.from(anomalies).filter(pos => 
            Math.floor(pos / DIGITS_PER_GROUP) === groupIndex
          ).map(pos => pos % DIGITS_PER_GROUP)}
        />
      ))}
    </div>
  );
};
