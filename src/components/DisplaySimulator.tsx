
import { useCallback, useEffect, useState, useRef } from "react";
import { DisplayGroup } from "./DisplayGroup";
import { AnomalyDetector, AnomalyReport } from "@/utils/anomalyDetector";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const TOTAL_GROUPS = 3;
const DIGITS_PER_GROUP = 4;

export const DisplaySimulator = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[][]>(
    Array(TOTAL_GROUPS).fill(Array(DIGITS_PER_GROUP).fill(0))
  );
  const [anomalies, setAnomalies] = useState<Set<number>>(new Set());
  const detectorRef = useRef<AnomalyDetector>();
  const intervalRef = useRef<number>();

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

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => {
      if (!prev) {
        // Starting
        intervalRef.current = window.setInterval(updateRandomDigit, 1000);
        toast({
          title: "Simulation Started",
          description: "Number generation process has begun",
        });
      } else {
        // Stopping
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        toast({
          title: "Simulation Paused",
          description: "Number generation process has been paused",
        });
      }
      return !prev;
    });
  }, [updateRandomDigit, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col space-y-8 p-8">
      <div className="flex justify-center mb-4">
        <Button
          onClick={toggleSimulation}
          className={`w-32 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
      </div>

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
