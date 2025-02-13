
import { DisplaySimulator } from "@/components/DisplaySimulator";
import { NumberHistory } from "@/components/NumberHistory";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-zinc-900 to-black p-4">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-white">Digital Display Capture</h1>
          <p className="text-zinc-400">Real-time number simulation and monitoring</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DisplaySimulator />
          </div>
          
          <div className="space-y-6">
            <NumberHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
