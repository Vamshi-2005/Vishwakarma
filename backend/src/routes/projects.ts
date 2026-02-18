import { Router, Request, Response } from 'express';
import { db } from '../database';
import {
  calculateMaterialRequirements,
  calculatePhases,
  calculateCostBreakdown,
  generateWeeklySchedule,
  generateLayoutSuggestions,
  calculateTimelineCompression,
  DEFAULT_CONFIG,
} from '../calculationEngine';
import { z } from 'zod';

const router = Router();

// Validation schemas
const CreateProjectSchema = z.object({
  projectName: z.string().min(1),
  builtUpArea: z.number().positive(),
  numberOfFloors: z.number().int().positive(),
  projectTimeline: z.number().int().positive(),
});

const UpdateConfigSchema = z.object({
  masonWage: z.number().positive().optional(),
  laborWage: z.number().positive().optional(),
  electricianWage: z.number().positive().optional(),
  plumberWage: z.number().positive().optional(),
  cementRate: z.number().positive().optional(),
  steelRate: z.number().positive().optional(),
  sandRate: z.number().positive().optional(),
  aggregateRate: z.number().positive().optional(),
  brickRate: z.number().positive().optional(),
});

const TimelineCompressionSchema = z.object({
  newTimeline: z.number().int().positive(),
});

// Get user ID from request (in real app, this would come from JWT)
const getUserId = (req: Request): string => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error('User ID not provided');
  }
  return userId;
};

// Error handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new project
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const body = CreateProjectSchema.parse(req.body);

    // Calculate initial costs
    const config = DEFAULT_CONFIG;
    const materials = calculateMaterialRequirements(
      {
        builtUpArea: body.builtUpArea,
        numberOfFloors: body.numberOfFloors,
        projectTimeline: body.projectTimeline,
      },
      config
    );
    const phases = calculatePhases(
      {
        builtUpArea: body.builtUpArea,
        numberOfFloors: body.numberOfFloors,
        projectTimeline: body.projectTimeline,
      },
      config
    );
    const costBreakdown = calculateCostBreakdown(materials, phases);

    // Create project
    const project = await db.createProject(
      userId,
      body.projectName,
      body.builtUpArea,
      body.numberOfFloors,
      body.projectTimeline,
      costBreakdown.totalCost
    );

    // Create default configuration
    await db.createProjectConfig(project.id, config);

    // Create phases
    const createdPhases = await db.createPhases(project.id, phases);

    // Create labor allocations for each phase
    for (let i = 0; i < createdPhases.length; i++) {
      const phaseData = phases[i];
      const createdPhase = createdPhases[i];
      await db.createLaborAllocations(createdPhase.id, phaseData.laborAllocations);
    }

    // Create material requirements
    await db.createMaterialRequirements(project.id, materials);

    // Create weekly schedules
    const schedules = generateWeeklySchedule(phases, materials);
    await db.createWeeklySchedules(project.id, schedules);

    // Create layout suggestions
    const layouts = generateLayoutSuggestions({
      builtUpArea: body.builtUpArea,
      numberOfFloors: body.numberOfFloors,
      projectTimeline: body.projectTimeline,
    });
    await db.createLayoutSuggestions(project.id, layouts);

    res.status(201).json({
      id: project.id,
      projectName: project.project_name,
      builtUpArea: project.built_up_area,
      numberOfFloors: project.number_of_floors,
      projectTimeline: project.project_timeline,
      totalCost: project.total_cost,
      status: project.status,
      createdAt: project.created_at,
    });
  })
);

// Get all projects for user
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const projects = await db.getUserProjects(userId);

    res.json(
      projects.map((p: any) => ({
        id: p.id,
        projectName: p.project_name,
        builtUpArea: p.built_up_area,
        numberOfFloors: p.number_of_floors,
        projectTimeline: p.project_timeline,
        totalCost: p.total_cost,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }))
    );
  })
);

// Get project details
router.get(
  '/:projectId',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { projectId } = req.params;

    const project = await db.getProject(projectId, userId);
    const config = await db.getProjectConfig(projectId);
    const phases = await db.getProjectPhases(projectId);
    const materials = await db.getProjectMaterials(projectId);
    const schedules = await db.getProjectSchedules(projectId);
    const layouts = await db.getLayoutSuggestions(projectId);

    // Fetch labor allocations for all phases
    const phasesWithLabor = await Promise.all(
      phases.map(async (phase: any) => ({
        ...phase,
        laborAllocations: await db.getLaborAllocations(phase.id),
      }))
    );

    res.json({
      project: {
        id: project.id,
        projectName: project.project_name,
        builtUpArea: project.built_up_area,
        numberOfFloors: project.number_of_floors,
        projectTimeline: project.project_timeline,
        totalCost: project.total_cost,
        status: project.status,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
      config: {
        masonWage: config.mason_wage,
        laborWage: config.labor_wage,
        electricianWage: config.electrician_wage,
        plumberWage: config.plumber_wage,
        cementRate: config.cement_rate,
        steelRate: config.steel_rate,
        sandRate: config.sand_rate,
        aggregateRate: config.aggregate_rate,
        brickRate: config.brick_rate,
      },
      phases: phasesWithLabor.map((p: any) => ({
        id: p.id,
        phaseName: p.phase_name,
        phaseOrder: p.phase_order,
        startWeek: p.start_week,
        durationWeeks: p.duration_weeks,
        costEstimate: p.cost_estimate,
        laborAllocations: p.laborAllocations.map((l: any) => ({
          id: l.id,
          workerType: l.worker_type,
          quantity: l.quantity,
          daysRequired: l.days_required,
        })),
      })),
      materials: materials.map((m: any) => ({
        id: m.id,
        materialName: m.material_name,
        quantity: m.quantity,
        unit: m.unit,
        cost: m.cost,
        phase: m.phase,
      })),
      schedules: schedules.map((s: any) => ({
        id: s.id,
        weekNumber: s.week_number,
        phaseName: s.phase_name,
        tasks: s.tasks,
        workforceRequired: s.workforce_required,
        materialsNeeded: s.materials_needed,
      })),
      layouts: layouts.map((l: any) => ({
        id: l.id,
        floorNumber: l.floor_number,
        layoutConfig: l.layout_config,
        totalRooms: l.total_rooms,
        suggestions: l.suggestions,
      })),
    });
  })
);

// Update project configuration
router.put(
  '/:projectId/config',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { projectId } = req.params;
    const body = UpdateConfigSchema.parse(req.body);

    // Verify user owns project
    await db.getProject(projectId, userId);

    const updatedConfig = await db.updateProjectConfig(projectId, body);

    res.json({
      masonWage: updatedConfig.mason_wage,
      laborWage: updatedConfig.labor_wage,
      electricianWage: updatedConfig.electrician_wage,
      plumberWage: updatedConfig.plumber_wage,
      cementRate: updatedConfig.cement_rate,
      steelRate: updatedConfig.steel_rate,
      sandRate: updatedConfig.sand_rate,
      aggregateRate: updatedConfig.aggregate_rate,
      brickRate: updatedConfig.brick_rate,
    });
  })
);

// Calculate timeline compression
router.post(
  '/:projectId/timeline-compression',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { projectId } = req.params;
    const body = TimelineCompressionSchema.parse(req.body);

    const project = await db.getProject(projectId, userId);
    const config = await db.getProjectConfig(projectId);
    const materials = await db.getProjectMaterials(projectId);
    const phases = await db.getProjectPhases(projectId);

    // Convert from DB format to calculation format
    const phaseData = phases.map((p: any) => ({
      phaseName: p.phase_name,
      phaseOrder: p.phase_order,
      startWeek: p.start_week,
      durationWeeks: p.duration_weeks,
      costEstimate: p.cost_estimate,
      laborAllocations: [],
    }));

    const materialData = materials.map((m: any) => ({
      materialName: m.material_name,
      quantity: m.quantity,
      unit: m.unit,
      cost: m.cost,
      phase: m.phase,
    }));

    const costBreakdown = calculateCostBreakdown(materialData, phaseData);
    const compression = calculateTimelineCompression(
      project.project_timeline,
      body.newTimeline,
      costBreakdown.totalCost
    );

    res.json(compression);
  })
);

// Delete project
router.delete(
  '/:projectId',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { projectId } = req.params;

    await db.deleteProject(projectId, userId);
    res.status(204).send();
  })
);

export default router;
