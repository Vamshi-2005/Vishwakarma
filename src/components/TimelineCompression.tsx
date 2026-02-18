import { useState } from 'react';
import { Zap, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { calculateTimelineCompression } from '../utils/calculationEngine';

interface TimelineCompressionProps {
  originalTimeline: number;
  originalCost: number;
  phases: any[];
}

export function TimelineCompression({
  originalTimeline,
  originalCost,
  phases,
}: TimelineCompressionProps) {
  const [newTimeline, setNewTimeline] = useState(originalTimeline);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleSimulate = () => {
    if (newTimeline >= originalTimeline) {
      alert('New timeline must be shorter than the original');
      return;
    }

    const result = calculateTimelineCompression(
      originalTimeline,
      newTimeline,
      originalCost,
      phases
    );
    setSimulationResult(result);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-yellow-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Timeline Compression Simulation</h2>
          <p className="text-sm text-gray-600">Analyze impact of reducing project duration</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Timeline
              </label>
              <div className="px-4 py-3 bg-white border border-gray-300 rounded-md">
                <span className="font-semibold text-gray-900">{originalTimeline} weeks</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Timeline (weeks)
              </label>
              <input
                type="number"
                value={newTimeline}
                onChange={(e) => setNewTimeline(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={Math.ceil(originalTimeline * 0.5)}
                max={originalTimeline - 1}
              />
            </div>
          </div>

          <button
            onClick={handleSimulate}
            className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            Simulate Compression
          </button>
        </div>

        {simulationResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">New Estimated Cost</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(simulationResult.newCost)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  +{formatCurrency(simulationResult.costIncrease)} (
                  {simulationResult.percentageIncrease.toFixed(1)}%)
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Workforce Increase</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  +{simulationResult.workforceIncrease.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Additional workers required</div>
              </div>
            </div>

            {simulationResult.risks.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-red-600" size={20} />
                  <span className="font-medium text-gray-900">Risk Assessment</span>
                </div>
                <ul className="space-y-2">
                  {simulationResult.risks.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
