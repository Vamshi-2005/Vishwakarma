import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import { v4 as uuidv4 } from 'uuid';
import {
  ProjectInputs,
  ProjectConfig,
  PhaseData,
  MaterialRequirement,
  WeeklySchedule,
  LayoutSuggestion,
} from './calculationEngine';

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

export const db = {
  // Projects
  async createProject(
    userId: string,
    projectName: string,
    builtUpArea: number,
    numberOfFloors: number,
    projectTimeline: number,
    totalCost: number
  ) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: uuidv4(),
        user_id: userId,
        project_name: projectName,
        built_up_area: builtUpArea,
        number_of_floors: numberOfFloors,
        project_timeline: projectTimeline,
        total_cost: totalCost,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProject(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(projectId: string, userId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Project Configurations
  async createProjectConfig(projectId: string, config: ProjectConfig) {
    const { data, error } = await supabase
      .from('project_configurations')
      .insert({
        id: uuidv4(),
        project_id: projectId,
        ...config,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProjectConfig(projectId: string) {
    const { data, error } = await supabase
      .from('project_configurations')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProjectConfig(projectId: string, config: Partial<ProjectConfig>) {
    const { data, error } = await supabase
      .from('project_configurations')
      .update(config)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Phases
  async createPhases(projectId: string, phases: PhaseData[]) {
    const phasesToInsert = phases.map((phase) => ({
      id: uuidv4(),
      project_id: projectId,
      phase_name: phase.phaseName,
      phase_order: phase.phaseOrder,
      start_week: phase.startWeek,
      duration_weeks: phase.durationWeeks,
      cost_estimate: phase.costEstimate,
    }));

    const { data, error } = await supabase
      .from('project_phases')
      .insert(phasesToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  async getProjectPhases(projectId: string) {
    const { data, error } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('phase_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createLaborAllocations(phaseId: string, laborAllocations: Array<any>) {
    const laborToInsert = laborAllocations.map((labor) => ({
      id: uuidv4(),
      phase_id: phaseId,
      worker_type: labor.workerType,
      quantity: labor.quantity,
      days_required: labor.daysRequired,
    }));

    const { data, error } = await supabase
      .from('labor_allocations')
      .insert(laborToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  async getLaborAllocations(phaseId: string) {
    const { data, error } = await supabase
      .from('labor_allocations')
      .select('*')
      .eq('phase_id', phaseId);

    if (error) throw error;
    return data;
  },

  // Materials
  async createMaterialRequirements(projectId: string, materials: MaterialRequirement[]) {
    const materialsToInsert = materials.map((material) => ({
      id: uuidv4(),
      project_id: projectId,
      material_name: material.materialName,
      quantity: material.quantity,
      unit: material.unit,
      cost: material.cost,
      phase: material.phase,
    }));

    const { data, error } = await supabase
      .from('material_requirements')
      .insert(materialsToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  async getProjectMaterials(projectId: string) {
    const { data, error } = await supabase
      .from('material_requirements')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  },

  // Weekly Schedules
  async createWeeklySchedules(projectId: string, schedules: WeeklySchedule[]) {
    const schedulesToInsert = schedules.map((schedule) => ({
      id: uuidv4(),
      project_id: projectId,
      week_number: schedule.weekNumber,
      phase_name: schedule.phaseName,
      tasks: schedule.tasks,
      workforce_required: schedule.workforceRequired,
      materials_needed: schedule.materialsNeeded,
    }));

    const { data, error } = await supabase
      .from('weekly_schedules')
      .insert(schedulesToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  async getProjectSchedules(projectId: string) {
    const { data, error } = await supabase
      .from('weekly_schedules')
      .select('*')
      .eq('project_id', projectId)
      .order('week_number', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Layout Suggestions
  async createLayoutSuggestions(projectId: string, suggestions: LayoutSuggestion[]) {
    const suggestionsToInsert = suggestions.map((suggestion) => ({
      id: uuidv4(),
      project_id: projectId,
      floor_number: suggestion.floorNumber,
      layout_config: suggestion.layoutConfig,
      total_rooms: suggestion.totalRooms,
      suggestions: suggestion.suggestions,
    }));

    const { data, error } = await supabase
      .from('layout_suggestions')
      .insert(suggestionsToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  async getLayoutSuggestions(projectId: string) {
    const { data, error } = await supabase
      .from('layout_suggestions')
      .select('*')
      .eq('project_id', projectId)
      .order('floor_number', { ascending: true });

    if (error) throw error;
    return data;
  },
};
