import { Users, HardHat } from 'lucide-react';
import { PhaseData } from '../utils/calculationEngine';

interface WorkforceAllocationProps {
  phases: PhaseData[];
}

export function WorkforceAllocation({ phases }: WorkforceAllocationProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalLaborCost = phases.reduce(
    (sum, phase) =>
      sum + phase.laborAllocations.reduce((pSum, labor) => pSum + labor.cost, 0),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-blue-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workforce Allocation</h2>
          <p className="text-sm text-gray-600">Labor requirements per construction phase</p>
        </div>
      </div>

      <div className="space-y-6">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardHat className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">{phase.phaseName}</span>
                </div>
                <span className="text-sm text-gray-600">
                  Week {phase.startWeek} - {phase.startWeek + phase.durationWeeks - 1}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {phase.laborAllocations.map((labor, laborIndex) => (
                <div
                  key={laborIndex}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium text-gray-900">{labor.workerType}</div>
                    <div className="text-sm text-gray-600">
                      {labor.quantity} workers × {labor.daysRequired} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(labor.cost)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phase Total</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(phase.costEstimate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">Total Labor Cost</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalLaborCost)}
          </span>
        </div>
      </div>
    </div>
  );
}
