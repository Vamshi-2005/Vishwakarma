import { useState } from 'react';
import { Building2, Layers, Calendar } from 'lucide-react';

interface ProjectInputFormProps {
  onSubmit: (data: {
    projectName: string;
    builtUpArea: number;
    numberOfFloors: number;
    projectTimeline: number;
  }) => void;
  isLoading?: boolean;
}

export function ProjectInputForm({ onSubmit, isLoading }: ProjectInputFormProps) {
  const [projectName, setProjectName] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [numberOfFloors, setNumberOfFloors] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName || !builtUpArea || !numberOfFloors || !projectTimeline) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({
      projectName,
      builtUpArea: parseFloat(builtUpArea),
      numberOfFloors: parseInt(numberOfFloors),
      projectTimeline: parseInt(projectTimeline),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
          Project Name
        </label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter project name"
          required
        />
      </div>

      <div>
        <label htmlFor="builtUpArea" className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            Built-up Area (sq. ft)
          </div>
        </label>
        <input
          type="number"
          id="builtUpArea"
          value={builtUpArea}
          onChange={(e) => setBuiltUpArea(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 1500"
          min="100"
          required
        />
      </div>

      <div>
        <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={18} />
            Number of Floors
          </div>
        </label>
        <input
          type="number"
          id="numberOfFloors"
          value={numberOfFloors}
          onChange={(e) => setNumberOfFloors(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 2"
          min="1"
          max="10"
          required
        />
      </div>

      <div>
        <label htmlFor="projectTimeline" className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            Project Timeline (weeks)
          </div>
        </label>
        <input
          type="number"
          id="projectTimeline"
          value={projectTimeline}
          onChange={(e) => setProjectTimeline(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 24"
          min="8"
          max="104"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating Plan...' : 'Generate Construction Plan'}
      </button>
    </form>
  );
}
