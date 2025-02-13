
import { DisplaySimulator } from "@/components/DisplaySimulator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-white">Digital Display Capture</h1>
          <p className="text-zinc-400">Real-time number simulation and monitoring</p>
        </div>
        <DisplaySimulator />
      </div>
    </div>
  );
};

export default Index;
