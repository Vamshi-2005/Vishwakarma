import { Package, Box } from 'lucide-react';
import { MaterialRequirement } from '../utils/calculationEngine';

interface MaterialRequirementsProps {
  materials: MaterialRequirement[];
}

export function MaterialRequirements({ materials }: MaterialRequirementsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalMaterialCost = materials.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-orange-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Material Requirements</h2>
          <p className="text-sm text-gray-600">Complete list of construction materials needed</p>
        </div>
      </div>

      <div className="space-y-3">
        {materials.map((material, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Box className="text-gray-600" size={20} />
              <div>
                <div className="font-medium text-gray-900">{material.materialName}</div>
                <div className="text-sm text-gray-600">
                  Phase: {material.phase}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {material.quantity.toLocaleString()} {material.unit}
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(material.cost)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">Total Material Cost</span>
          <span className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalMaterialCost)}
          </span>
        </div>
      </div>
    </div>
  );
}
