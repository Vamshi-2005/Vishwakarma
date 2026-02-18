import { Home, Lightbulb, Layout } from 'lucide-react';
import { LayoutSuggestion } from '../utils/calculationEngine';

interface LayoutSuggestionsProps {
  suggestions: LayoutSuggestion[];
}

export function LayoutSuggestions({ suggestions }: LayoutSuggestionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Layout className="text-blue-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Layout Suggestions</h2>
          <p className="text-sm text-gray-600">Intelligent floor plan recommendations</p>
        </div>
      </div>

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Home className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-900">
                  Floor {suggestion.floorNumber}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">
                  {suggestion.totalRooms} total spaces
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Bedrooms</div>
                  <div className="text-xl font-bold text-gray-900">
                    {suggestion.layoutConfig.bedrooms}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Bathrooms</div>
                  <div className="text-xl font-bold text-gray-900">
                    {suggestion.layoutConfig.bathrooms}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Living Room</div>
                  <div className="text-xl font-bold text-gray-900">
                    {suggestion.layoutConfig.livingRoom}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Kitchen</div>
                  <div className="text-xl font-bold text-gray-900">
                    {suggestion.layoutConfig.kitchen}
                  </div>
                </div>
                {suggestion.layoutConfig.diningRoom > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Dining Room</div>
                    <div className="text-xl font-bold text-gray-900">
                      {suggestion.layoutConfig.diningRoom}
                    </div>
                  </div>
                )}
                {suggestion.layoutConfig.balconies > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Balconies</div>
                    <div className="text-xl font-bold text-gray-900">
                      {suggestion.layoutConfig.balconies}
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Utility</div>
                  <div className="text-xl font-bold text-gray-900">
                    {suggestion.layoutConfig.utilities}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <div className="font-medium text-gray-900 mb-1">AI Recommendation</div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {suggestion.suggestions}
                    </p>
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
