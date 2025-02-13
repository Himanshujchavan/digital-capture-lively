
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  timestamp: number;
  position: number;
  value: number;
  type?: 'normal' | 'anomaly';
  description?: string;
}

export const NumberHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const handleHistoryUpdate = (event: CustomEvent<HistoryEntry>) => {
      setHistory(prev => {
        const newHistory = [event.detail, ...prev].slice(0, 100);
        return newHistory;
      });
    };

    window.addEventListener('number-update' as any, handleHistoryUpdate);
    window.addEventListener('anomaly-detected' as any, handleHistoryUpdate);

    return () => {
      window.removeEventListener('number-update' as any, handleHistoryUpdate);
      window.removeEventListener('anomaly-detected' as any, handleHistoryUpdate);
    };
  }, []);

  const downloadCSV = () => {
    const last30 = history.slice(0, 30);
    const csvContent = [
      "Timestamp,Position,Value,Type,Description",
      ...last30.map(entry => 
        `${new Date(entry.timestamp).toISOString()},${entry.position},${entry.value},${entry.type || 'normal'},${entry.description || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `number-history-${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">History</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCSV}
          className="text-xs"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>

      <ScrollArea className="h-[500px] rounded-lg">
        <div className="space-y-2 p-2">
          {history.map((entry, index) => (
            <Card
              key={index}
              className={cn(
                "p-3 bg-black/40 border-white/5",
                entry.type === 'anomaly' && "border-red-500/20 bg-red-500/5"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-white/90">
                    Position {entry.position}: {entry.value}
                  </div>
                  {entry.description && (
                    <p className="text-xs text-red-400 mt-1">
                      {entry.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-white/50">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
