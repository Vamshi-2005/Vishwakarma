import { Clock, CheckCircle } from 'lucide-react';
import { PhaseData } from '../utils/calculationEngine';

interface ConstructionPhasesProps {
  phases: PhaseData[];
}

export function ConstructionPhases({ phases }: ConstructionPhasesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-blue-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Construction Phases</h2>
          <p className="text-sm text-gray-600">Phase-wise project timeline and breakdown</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={index} className="relative flex gap-4">
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold border-4 border-white shadow-md">
                {phase.phaseOrder}
              </div>
              <div className="flex-1 pb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.phaseName}</h3>
                    <CheckCircle className="text-gray-400" size={20} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium text-gray-900">
                        {phase.durationWeeks} weeks
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Start Week</span>
                      <span className="font-medium text-gray-900">Week {phase.startWeek}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">End Week</span>
                      <span className="font-medium text-gray-900">
                        Week {phase.startWeek + phase.durationWeeks - 1}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Workforce</span>
                        <span className="text-sm font-medium text-gray-900">
                          {phase.laborAllocations.length} types
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
