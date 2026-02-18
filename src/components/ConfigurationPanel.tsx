import { useState } from 'react';
import { Settings, DollarSign } from 'lucide-react';
import { ProjectConfig, DEFAULT_CONFIG } from '../utils/calculationEngine';

interface ConfigurationPanelProps {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
}

export function ConfigurationPanel({ config, onChange }: ConfigurationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof ProjectConfig, value: string) => {
    onChange({
      ...config,
      [field]: parseFloat(value) || 0,
    });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_CONFIG);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Settings className="text-blue-600" size={24} />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Cost Configuration</h3>
            <p className="text-sm text-gray-600">Customize wages and material rates</p>
          </div>
        </div>
        <span className="text-gray-400">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" />
                Labor Wages (per day)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mason
                  </label>
                  <input
                    type="number"
                    value={config.masonWage}
                    onChange={(e) => handleChange('masonWage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labor
                  </label>
                  <input
                    type="number"
                    value={config.laborWage}
                    onChange={(e) => handleChange('laborWage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Electrician
                  </label>
                  <input
                    type="number"
                    value={config.electricianWage}
                    onChange={(e) => handleChange('electricianWage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plumber
                  </label>
                  <input
                    type="number"
                    value={config.plumberWage}
                    onChange={(e) => handleChange('plumberWage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-orange-600" />
                Material Rates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cement (per bag)
                  </label>
                  <input
                    type="number"
                    value={config.cementRate}
                    onChange={(e) => handleChange('cementRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Steel (per kg)
                  </label>
                  <input
                    type="number"
                    value={config.steelRate}
                    onChange={(e) => handleChange('steelRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sand (per m³)
                  </label>
                  <input
                    type="number"
                    value={config.sandRate}
                    onChange={(e) => handleChange('sandRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aggregate (per m³)
                  </label>
                  <input
                    type="number"
                    value={config.aggregateRate}
                    onChange={(e) => handleChange('aggregateRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bricks (per 1000 units)
                  </label>
                  <input
                    type="number"
                    value={config.brickRate}
                    onChange={(e) => handleChange('brickRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={resetToDefaults}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
