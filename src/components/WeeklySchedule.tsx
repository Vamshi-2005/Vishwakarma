import { Calendar, CheckSquare, Users, Package } from 'lucide-react';
import { WeeklySchedule as WeeklyScheduleType } from '../utils/calculationEngine';

interface WeeklyScheduleProps {
  schedule: WeeklyScheduleType[];
}

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-green-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Schedule</h2>
          <p className="text-sm text-gray-600">Week-by-week construction timeline</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {schedule.map((week, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-600">Week {week.weekNumber}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-700">{week.phaseName}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="text-blue-600" size={18} />
                  <span className="font-medium text-gray-900">Tasks</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {week.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-blue-600" size={18} />
                    <span className="font-medium text-gray-900">Workforce</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(week.workforceRequired).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-gray-700">{type}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="text-orange-600" size={18} />
                    <span className="font-medium text-gray-900">Materials</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(week.materialsNeeded).map(([material, quantity]) => (
                      <div key={material} className="flex justify-between text-sm">
                        <span className="text-gray-700">{material}</span>
                        <span className="font-medium text-gray-900">{quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
