/**
 * API Service Layer
 * Handles all communication with the backend construction planning API
 * Base URL can be configured via environment variable VITE_API_BASE_URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Get user ID from localStorage or generate a temporary one
// In production, this should come from your authentication system (e.g., Supabase Auth)
const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Common fetch options with user ID header
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'x-user-id': getUserId(),
});

// Error handling wrapper
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
}

// ========================= Project APIs =========================

export interface ProjectInput {
  projectName: string;
  builtUpArea: number;
  numberOfFloors: number;
  projectTimeline: number;
}

export interface Project {
  id: string;
  projectName: string;
  builtUpArea: number;
  numberOfFloors: number;
  projectTimeline: number;
  totalCost: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectConfig {
  masonWage: number;
  laborWage: number;
  electricianWage: number;
  plumberWage: number;
  cementRate: number;
  steelRate: number;
  sandRate: number;
  aggregateRate: number;
  brickRate: number;
}

export interface ProjectDetail extends Project {
  config: ProjectConfig;
  materials: any[];
  phases: any[];
  schedules: any[];
  layouts: any[];
}

/**
 * Create a new construction project
 * Triggers full calculations (materials, phases, costs, schedules, layouts)
 */
export async function createProject(project: ProjectInput): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      projectName: project.projectName,
      builtUpArea: project.builtUpArea,
      numberOfFloors: project.numberOfFloors,
      projectTimeline: project.projectTimeline,
    }),
  });
  return handleResponse<Project>(response);
}

/**
 * Get list of all projects for current user
 */
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<Project[]>(response);
}

/**
 * Get project details with all calculations
 * Returns project + config + materials + phases + schedules + layout suggestions
 */
export async function getProjectDetail(projectId: string): Promise<ProjectDetail> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<ProjectDetail>(response);
}

/**
 * Update project configuration (wages and material rates)
 */
export async function updateProjectConfig(
  projectId: string,
  config: Partial<ProjectConfig>
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/config`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(config),
  });
  return handleResponse<Project>(response);
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}

// ========================= Timeline Compression APIs =========================

export interface CompressionAnalysis {
  originalTimeline: number;
  compressedTimeline: number;
  originalCost: number;
  compressedCost: number;
  costIncrease: number;
  riskLevel: string;
  recommendations: string[];
}

/**
 * Analyze timeline compression options
 */
export async function analyzeTimelineCompression(
  projectId: string,
  targetTimeline: number
): Promise<CompressionAnalysis> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/timeline-compression`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ targetTimeline }),
  });
  return handleResponse<CompressionAnalysis>(response);
}

// ========================= Utility APIs =========================

export interface DefaultConfig {
  masonWage: number;
  laborWage: number;
  electricianWage: number;
  plumberWage: number;
  cementRate: number;
  steelRate: number;
  sandRate: number;
  aggregateRate: number;
  brickRate: number;
}

/**
 * Get default configuration (standard wages and material rates)
 */
export async function getDefaultConfig(): Promise<DefaultConfig> {
  const response = await fetch(`${API_BASE_URL}/default-config`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<DefaultConfig>(response);
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
  });
  return handleResponse<{ status: string }>(response);
}

// ========================= Helper Functions =========================

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Get display name for user
 */
export function getUserDisplayName(): string {
  const name = localStorage.getItem('userName');
  return name || 'User';
}

/**
 * Set display name for user
 */
export function setUserDisplayName(name: string): void {
  localStorage.setItem('userName', name);
}
