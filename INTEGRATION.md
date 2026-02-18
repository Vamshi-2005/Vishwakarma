# Frontend-Backend Integration Guide

## Overview

Your React frontend can now connect to the backend API for persistent data storage and server-side calculations.

## Step 1: Create API Service

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ProjectCreateData {
  projectName: string;
  builtUpArea: number;
  numberOfFloors: number;
  projectTimeline: number;
}

interface ProjectConfig {
  masonWage?: number;
  laborWage?: number;
  electricianWage?: number;
  plumberWage?: number;
  cementRate?: number;
  steelRate?: number;
  sandRate?: number;
  aggregateRate?: number;
  brickRate?: number;
}

// Get user ID (from auth context or localStorage)
function getUserId(): string {
  return localStorage.getItem('userId') || 'guest-user';
}

export const projectAPI = {
  // Create new project
  async createProject(data: ProjectCreateData) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return response.json();
  },

  // Get all projects
  async getAllProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'x-user-id': getUserId(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  },

  // Get project details
  async getProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'x-user-id': getUserId(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    return response.json();
  },

  // Update configuration
  async updateConfiguration(projectId: string, config: ProjectConfig) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to update configuration');
    }

    return response.json();
  },

  // Analyze timeline compression
  async analyzeTimelineCompression(projectId: string, newTimeline: number) {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/timeline-compression`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getUserId(),
        },
        body: JSON.stringify({ newTimeline }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to analyze timeline');
    }

    return response.json();
  },

  // Delete project
  async deleteProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': getUserId(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },

  // Get default configuration
  async getDefaultConfig() {
    const response = await fetch(`${API_BASE_URL}/default-config`);

    if (!response.ok) {
      throw new Error('Failed to fetch default config');
    }

    return response.json();
  },
};
```

## Step 2: Update App.tsx

Replace the mock data flow with backend integration:

```typescript
import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { projectAPI } from './lib/api';
import { ProjectInputForm } from './components/ProjectInputForm';
// ... other imports

type ViewMode = 'input' | 'results' | 'projects';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setIsLoading(true);
      const data = await projectAPI.getAllProjects();
      setProjects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProjectSubmit(data: {
    projectName: string;
    builtUpArea: number;
    numberOfFloors: number;
    projectTimeline: number;
  }) {
    try {
      setIsLoading(true);
      const newProject = await projectAPI.createProject(data);
      
      // Load full project details
      const projectDetails = await projectAPI.getProject(newProject.id);
      setSelectedProject(projectDetails);
      setViewMode('results');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNewProject() {
    setViewMode('input');
    setSelectedProject(null);
  }

  async function handleDeleteProject(projectId: string) {
    try {
      setIsLoading(true);
      await projectAPI.deleteProject(projectId);
      await loadProjects();
      setViewMode('projects');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function openProject(projectId: string) {
    try {
      setIsLoading(true);
      const projectDetails = await projectAPI.getProject(projectId);
      setSelectedProject(projectDetails);
      setViewMode('results');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  // Render different views
  if (viewMode === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-600" size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Construction Planning Platform
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setViewMode('projects')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <ProjectInputForm onSubmit={handleProjectSubmit} isLoading={isLoading} />
        </main>
      </div>
    );
  }

  if (viewMode === 'results' && selectedProject) {
    const { project, materials, phases, schedules, layouts } = selectedProject;
    
    // Extract calculated data
    const materialCost = materials.reduce((sum: number, m: any) => sum + m.cost, 0);
    const laborCost = phases.reduce((sum: number, p: any) => {
      return sum + p.laborAllocations.reduce((s: number, l: any) => s + l.cost, 0);
    }, 0);
    const totalCost = materialCost + laborCost;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
              <button
                onClick={handleNewProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                New Project
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Your existing component structure here */}
          <CostBreakdown 
            materialCost={materialCost}
            laborCost={laborCost}
            totalCost={totalCost}
          />
          <MaterialRequirements materials={materials} />
          <ConstructionPhases phases={phases} />
          {/* ... other components */}
        </main>
      </div>
    );
  }

  // Projects List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <button
              onClick={() => setViewMode('input')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <button
              onClick={() => setViewMode('input')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer"
                onClick={() => openProject(project.id)}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.projectName}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Area: {project.builtUpArea} sq ft</p>
                  <p>Floors: {project.numberOfFloors}</p>
                  <p>Timeline: {project.projectTimeline} weeks</p>
                  <p className="font-semibold text-blue-600 mt-2">
                    ₹{project.totalCost?.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="w-full px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

## Step 3: Environment Configuration

Create `.env.local` in frontend root:

```
REACT_APP_API_URL=http://localhost:3001/api
```

For production:

```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Step 4: Handle Authentication

Update `src/lib/api.ts` to get user ID from auth context:

```typescript
import { useAuth } from './auth-context'; // Your auth provider

function getUserId(): string {
  const { user } = useAuth();
  if (user?.id) return user.id;
  
  // Fallback to localStorage for testing
  const stored = localStorage.getItem('userId');
  if (stored) return stored;
  
  // Fallback for demo
  return 'demo-user';
}
```

Or for Supabase auth:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function getUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id || 'guest';
}

// Update API calls
export const projectAPI = {
  async createProject(data: ProjectCreateData) {
    const userId = await getUserId();
    // ... rest of function
  },
};
```

## Step 5: Update Configuration Panel

When user updates rates, save to backend:

```typescript
export function ConfigurationPanel({ projectId, onConfigChange }: Props) {
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  async function handleConfigChange(newConfig: Partial<ProjectConfig>) {
    try {
      setIsSaving(true);
      const updated = await projectAPI.updateConfiguration(projectId, newConfig);
      setConfig(updated);
      onConfigChange?.(updated);
    } catch (error) {
      console.error('Failed to update configuration', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Form fields */}
      <button
        onClick={() => handleConfigChange(config)}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Configuration'}
      </button>
    </div>
  );
}
```

## Step 6: Handle Timeline Compression

```typescript
export function TimelineCompression({ projectId }: Props) {
  const [newTimeline, setNewTimeline] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function analyze() {
    try {
      setIsAnalyzing(true);
      const analysis = await projectAPI.analyzeTimelineCompression(
        projectId,
        newTimeline
      );
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div>
      <input
        type="number"
        value={newTimeline}
        onChange={(e) => setNewTimeline(parseInt(e.target.value))}
        placeholder="New timeline (weeks)"
      />
      <button onClick={analyze} disabled={isAnalyzing}>
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </button>
      {result && (
        <div>
          <p>Cost Increase: ₹{result.costIncrease}</p>
          <p>Percentage: {result.percentageIncrease.toFixed(1)}%</p>
          <p>Workforce Increase: {result.workforceIncrease.toFixed(1)}%</p>
          <ul>
            {result.risks.map((risk: string) => (
              <li key={risk} className="text-red-600">
                ⚠️ {risk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Step 7: Error Handling

Add global error boundary:

```typescript
// src/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="font-bold text-red-800">Something went wrong</h2>
          <p className="text-red-700">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// In App.tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Testing Integration

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   # Runs on http://localhost:3001
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

3. **Test Create Project**
   - Open frontend
   - Fill form and submit
   - Check browser console for API call
   - Verify data appears in project list

4. **Test API Directly**
   ```bash
   curl -X POST http://localhost:3001/api/projects \
     -H "Content-Type: application/json" \
     -H "x-user-id: test-user" \
     -d '{"projectName":"Test","builtUpArea":1500,"numberOfFloors":4,"projectTimeline":52}'
   ```

## Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Ensure backend `.env` has correct `FRONTEND_URL`

### 404 on API calls
```
GET http://localhost:3001/api/projects 404
```

**Solution:** 
- Check backend is running
- Check API_BASE_URL in frontend
- Check route path in backend

### User ID not provided
```
Error: User ID is required
```

**Solution:** Ensure `x-user-id` header is sent with all project requests

### Build errors
```bash
npm run type-check  # Check types
npm install         # Reinstall dependencies
```

---

## Summary

Your frontend and backend are now fully integrated! Users can:

✅ Create projects with persistent storage
✅ View project details
✅ Update project configuration
✅ Analyze timeline compression
✅ Delete projects
✅ See all their projects

Next: Deploy both to production!
