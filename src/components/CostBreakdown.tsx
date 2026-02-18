import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { CostBreakdown as CostBreakdownType } from '../utils/calculationEngine';

interface CostBreakdownProps {
  costData: CostBreakdownType;
}

export function CostBreakdown({ costData }: CostBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const materialPercentage = (costData.materialCost / costData.totalCost) * 100;
  const laborPercentage = (costData.laborCost / costData.totalCost) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-green-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cost Estimation</h2>
          <p className="text-sm text-gray-600">Detailed breakdown of project costs</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={24} />
              <span className="text-gray-700 font-medium">Total Project Cost</span>
            </div>
            <span className="text-3xl font-bold text-blue-600">
              {formatCurrency(costData.totalCost)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <Package className="text-orange-600" size={20} />
              <span className="text-gray-700 font-medium">Material Cost</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(costData.materialCost)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-600 h-full"
                    style={{ width: `${materialPercentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {materialPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-5 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-green-600" size={20} />
              <span className="text-gray-700 font-medium">Labor Cost</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(costData.laborCost)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-600 h-full"
                    style={{ width: `${laborPercentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {laborPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estimated cost per sq. ft:</span>
            <span className="font-semibold text-gray-900">
              Based on total built-up area
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
