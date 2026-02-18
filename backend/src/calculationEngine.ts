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

export interface ProjectInputs {
  builtUpArea: number;
  numberOfFloors: number;
  projectTimeline: number;
}

export interface MaterialRequirement {
  materialName: string;
  quantity: number;
  unit: string;
  cost: number;
  phase: string;
}

export interface LaborAllocation {
  workerType: string;
  quantity: number;
  daysRequired: number;
  cost: number;
}

export interface PhaseData {
  phaseName: string;
  phaseOrder: number;
  startWeek: number;
  durationWeeks: number;
  costEstimate: number;
  laborAllocations: LaborAllocation[];
}

export interface CostBreakdown {
  materialCost: number;
  laborCost: number;
  totalCost: number;
}

export interface WeeklySchedule {
  weekNumber: number;
  phaseName: string;
  tasks: string[];
  workforceRequired: Record<string, number>;
  materialsNeeded: Record<string, number>;
}

export interface LayoutSuggestion {
  floorNumber: number;
  totalRooms: number;
  layoutConfig: {
    bedrooms: number;
    bathrooms: number;
    kitchen: number;
    livingRoom: number;
    diningRoom: number;
    balconies: number;
    utilities: number;
  };
  suggestions: string;
}

export const DEFAULT_CONFIG: ProjectConfig = {
  masonWage: 800,
  laborWage: 600,
  electricianWage: 1000,
  plumberWage: 1000,
  cementRate: 400,
  steelRate: 60,
  sandRate: 1500,
  aggregateRate: 1800,
  brickRate: 6000,
};

export function calculateMaterialRequirements(
  inputs: ProjectInputs,
  config: ProjectConfig
): MaterialRequirement[] {
  const { builtUpArea, numberOfFloors } = inputs;
  const totalArea = builtUpArea * numberOfFloors;

  const cementBags = Math.ceil(totalArea * 0.4);
  const steelKg = Math.ceil(totalArea * 4);
  const sandCubicMeters = Math.ceil(totalArea * 0.05);
  const aggregateCubicMeters = Math.ceil(totalArea * 0.06);
  const bricks = Math.ceil(totalArea * 8);

  return [
    {
      materialName: 'Cement',
      quantity: cementBags,
      unit: 'bags',
      cost: cementBags * config.cementRate,
      phase: 'Foundation & Structure',
    },
    {
      materialName: 'Steel',
      quantity: steelKg,
      unit: 'kg',
      cost: steelKg * config.steelRate,
      phase: 'Structure',
    },
    {
      materialName: 'Sand',
      quantity: sandCubicMeters,
      unit: 'm³',
      cost: sandCubicMeters * config.sandRate,
      phase: 'Foundation & Structure',
    },
    {
      materialName: 'Aggregate',
      quantity: aggregateCubicMeters,
      unit: 'm³',
      cost: aggregateCubicMeters * config.aggregateRate,
      phase: 'Foundation & Structure',
    },
    {
      materialName: 'Bricks',
      quantity: bricks,
      unit: 'units',
      cost: (bricks / 1000) * config.brickRate,
      phase: 'Structure & Finishing',
    },
  ];
}

export function calculatePhases(
  inputs: ProjectInputs,
  config: ProjectConfig
): PhaseData[] {
  const { builtUpArea, numberOfFloors, projectTimeline } = inputs;
  const totalArea = builtUpArea * numberOfFloors;

  const foundationWeeks = Math.ceil(projectTimeline * 0.25);
  const structureWeeks = Math.ceil(projectTimeline * 0.35);
  const roofingWeeks = Math.ceil(projectTimeline * 0.15);
  const finishingWeeks = projectTimeline - foundationWeeks - structureWeeks - roofingWeeks;

  const phases: PhaseData[] = [
    {
      phaseName: 'Foundation',
      phaseOrder: 1,
      startWeek: 1,
      durationWeeks: foundationWeeks,
      costEstimate: 0,
      laborAllocations: [
        {
          workerType: 'Mason',
          quantity: Math.ceil(totalArea / 500),
          daysRequired: foundationWeeks * 6,
          cost: Math.ceil(totalArea / 500) * foundationWeeks * 6 * config.masonWage,
        },
        {
          workerType: 'Labor',
          quantity: Math.ceil(totalArea / 300),
          daysRequired: foundationWeeks * 6,
          cost: Math.ceil(totalArea / 300) * foundationWeeks * 6 * config.laborWage,
        },
      ],
    },
    {
      phaseName: 'Structure',
      phaseOrder: 2,
      startWeek: foundationWeeks + 1,
      durationWeeks: structureWeeks,
      costEstimate: 0,
      laborAllocations: [
        {
          workerType: 'Mason',
          quantity: Math.ceil(totalArea / 400),
          daysRequired: structureWeeks * 6,
          cost: Math.ceil(totalArea / 400) * structureWeeks * 6 * config.masonWage,
        },
        {
          workerType: 'Labor',
          quantity: Math.ceil(totalArea / 250),
          daysRequired: structureWeeks * 6,
          cost: Math.ceil(totalArea / 250) * structureWeeks * 6 * config.laborWage,
        },
      ],
    },
    {
      phaseName: 'Roofing',
      phaseOrder: 3,
      startWeek: foundationWeeks + structureWeeks + 1,
      durationWeeks: roofingWeeks,
      costEstimate: 0,
      laborAllocations: [
        {
          workerType: 'Mason',
          quantity: Math.ceil(totalArea / 600),
          daysRequired: roofingWeeks * 6,
          cost: Math.ceil(totalArea / 600) * roofingWeeks * 6 * config.masonWage,
        },
        {
          workerType: 'Labor',
          quantity: Math.ceil(totalArea / 400),
          daysRequired: roofingWeeks * 6,
          cost: Math.ceil(totalArea / 400) * roofingWeeks * 6 * config.laborWage,
        },
      ],
    },
    {
      phaseName: 'Finishing',
      phaseOrder: 4,
      startWeek: foundationWeeks + structureWeeks + roofingWeeks + 1,
      durationWeeks: finishingWeeks,
      costEstimate: 0,
      laborAllocations: [
        {
          workerType: 'Mason',
          quantity: Math.ceil(totalArea / 500),
          daysRequired: finishingWeeks * 6,
          cost: Math.ceil(totalArea / 500) * finishingWeeks * 6 * config.masonWage,
        },
        {
          workerType: 'Electrician',
          quantity: Math.ceil(totalArea / 800),
          daysRequired: finishingWeeks * 6,
          cost: Math.ceil(totalArea / 800) * finishingWeeks * 6 * config.electricianWage,
        },
        {
          workerType: 'Plumber',
          quantity: Math.ceil(totalArea / 800),
          daysRequired: finishingWeeks * 6,
          cost: Math.ceil(totalArea / 800) * finishingWeeks * 6 * config.plumberWage,
        },
        {
          workerType: 'Labor',
          quantity: Math.ceil(totalArea / 350),
          daysRequired: finishingWeeks * 6,
          cost: Math.ceil(totalArea / 350) * finishingWeeks * 6 * config.laborWage,
        },
      ],
    },
  ];

  phases.forEach((phase) => {
    phase.costEstimate = phase.laborAllocations.reduce(
      (sum, labor) => sum + labor.cost,
      0
    );
  });

  return phases;
}

export function calculateCostBreakdown(
  materials: MaterialRequirement[],
  phases: PhaseData[]
): CostBreakdown {
  const materialCost = materials.reduce((sum, material) => sum + material.cost, 0);
  const laborCost = phases.reduce(
    (sum, phase) =>
      sum + phase.laborAllocations.reduce((pSum, labor) => pSum + labor.cost, 0),
    0
  );

  return {
    materialCost,
    laborCost,
    totalCost: materialCost + laborCost,
  };
}

function generateTasksForWeek(
  phaseName: string,
  weekIndex: number,
  isFirstWeek: boolean,
  isLastWeek: boolean
): string[] {
  const taskMap: Record<string, string[][]> = {
    Foundation: [
      ['Site preparation and marking', 'Excavation work begins', 'Soil testing'],
      ['Deep excavation', 'Foundation layout marking', 'Reinforcement preparation'],
      ['Foundation concrete pouring', 'Curing process', 'Foundation leveling'],
      ['Foundation waterproofing', 'Backfilling', 'Quality inspection'],
    ],
    Structure: [
      ['Column reinforcement', 'Formwork preparation', 'First floor slab preparation'],
      ['Beam and slab reinforcement', 'Concrete pouring', 'Curing'],
      ['Second floor construction', 'Column extension', 'Wall construction'],
      ['Structural completion', 'Load testing', 'Quality checks'],
    ],
    Roofing: [
      ['Roof slab preparation', 'Waterproofing layer', 'Insulation work'],
      ['Roof finishing', 'Drainage system', 'Parapet construction'],
      ['Final waterproofing', 'Roof testing', 'Completion checks'],
    ],
    Finishing: [
      ['Electrical conduit installation', 'Plumbing rough-in', 'Window and door frames'],
      ['Plastering work', 'Flooring preparation', 'Electrical wiring'],
      ['Painting and finishing', 'Fixture installation', 'Final touches'],
      ['Quality inspection', 'Cleaning', 'Handover preparation'],
    ],
  };

  const phaseTasks = taskMap[phaseName] || [['Work in progress']];
  const taskIndex = Math.min(weekIndex, phaseTasks.length - 1);

  return phaseTasks[taskIndex];
}

export function generateWeeklySchedule(
  phases: PhaseData[],
  materials: MaterialRequirement[]
): WeeklySchedule[] {
  const schedule: WeeklySchedule[] = [];

  phases.forEach((phase) => {
    for (let week = 0; week < phase.durationWeeks; week++) {
      const weekNumber = phase.startWeek + week;
      const isFirstWeek = week === 0;
      const isLastWeek = week === phase.durationWeeks - 1;

      const tasks = generateTasksForWeek(phase.phaseName, week, isFirstWeek, isLastWeek);

      const workforceRequired: Record<string, number> = {};
      phase.laborAllocations.forEach((labor) => {
        workforceRequired[labor.workerType] = labor.quantity;
      });

      const materialsNeeded: Record<string, number> = {};
      materials
        .filter((m) => m.phase.includes(phase.phaseName))
        .forEach((material) => {
          const weeklyQuantity = material.quantity / phase.durationWeeks;
          materialsNeeded[material.materialName] = Math.ceil(weeklyQuantity);
        });

      schedule.push({
        weekNumber,
        phaseName: phase.phaseName,
        tasks,
        workforceRequired,
        materialsNeeded,
      });
    }
  });

  return schedule;
}

export function generateLayoutSuggestions(
  inputs: ProjectInputs
): LayoutSuggestion[] {
  const { builtUpArea, numberOfFloors } = inputs;
  const suggestions: LayoutSuggestion[] = [];

  for (let floor = 1; floor <= numberOfFloors; floor++) {
    const isGroundFloor = floor === 1;
    const isTopFloor = floor === numberOfFloors;

    let bedrooms = 0;
    let bathrooms = 0;
    let kitchen = 0;
    let livingRoom = 0;
    let diningRoom = 0;
    let balconies = 0;
    let utilities = 0;

    if (builtUpArea < 800) {
      bedrooms = 2;
      bathrooms = 1;
      kitchen = 1;
      livingRoom = 1;
      diningRoom = 0;
      balconies = isGroundFloor ? 0 : 1;
      utilities = 1;
    } else if (builtUpArea < 1500) {
      bedrooms = 3;
      bathrooms = 2;
      kitchen = 1;
      livingRoom = 1;
      diningRoom = 1;
      balconies = isGroundFloor ? 0 : 1;
      utilities = 1;
    } else if (builtUpArea < 2500) {
      bedrooms = 4;
      bathrooms = 3;
      kitchen = 1;
      livingRoom = 1;
      diningRoom = 1;
      balconies = 2;
      utilities = 1;
    } else {
      bedrooms = 5;
      bathrooms = 4;
      kitchen = 1;
      livingRoom = 2;
      diningRoom = 1;
      balconies = 2;
      utilities = 2;
    }

    const totalRooms = bedrooms + bathrooms + kitchen + livingRoom + diningRoom + balconies + utilities;

    let suggestionText = '';

    if (isGroundFloor) {
      suggestionText = `Ground floor optimized for common areas. Consider placing living room, dining room, and kitchen with easy access. Include a guest bedroom if space permits. Ensure proper ventilation and natural lighting.`;
    } else if (isTopFloor) {
      suggestionText = `Top floor ideal for private spaces. Position bedrooms to maximize privacy and natural light. Consider a terrace or extended balcony space. Master bedroom can have attached bathroom and balcony access.`;
    } else {
      suggestionText = `Mid-floor layout balanced for bedrooms and family spaces. Optimize room placement for cross-ventilation. Consider positioning bathrooms centrally to reduce plumbing costs.`;
    }

    suggestions.push({
      floorNumber: floor,
      totalRooms,
      layoutConfig: {
        bedrooms,
        bathrooms,
        kitchen,
        livingRoom,
        diningRoom,
        balconies,
        utilities,
      },
      suggestions: suggestionText,
    });
  }

  return suggestions;
}

export function calculateTimelineCompression(
  originalTimeline: number,
  newTimeline: number,
  originalCost: number
): {
  newCost: number;
  costIncrease: number;
  percentageIncrease: number;
  workforceIncrease: number;
  risks: string[];
} {
  const compressionRatio = newTimeline / originalTimeline;

  const workforceMultiplier = 1 / compressionRatio;
  const efficiencyLoss = 1 - compressionRatio;
  const overtimeCost = originalCost * 0.3 * efficiencyLoss;
  const additionalWorkforceCost = originalCost * 0.4 * (workforceMultiplier - 1);

  const newCost = originalCost + overtimeCost + additionalWorkforceCost;
  const costIncrease = newCost - originalCost;
  const percentageIncrease = (costIncrease / originalCost) * 100;

  const risks: string[] = [];

  if (compressionRatio < 0.7) {
    risks.push('Severe timeline compression may compromise quality');
    risks.push('Worker fatigue and safety concerns');
    risks.push('Material procurement challenges');
  } else if (compressionRatio < 0.85) {
    risks.push('Moderate risk of quality issues');
    risks.push('Increased overtime requirements');
    risks.push('Coordination complexity increases');
  }

  if (workforceMultiplier > 1.5) {
    risks.push('Significant workforce increase required');
    risks.push('Site congestion and management challenges');
  }

  return {
    newCost,
    costIncrease,
    percentageIncrease,
    workforceIncrease: (workforceMultiplier - 1) * 100,
    risks,
  };
}
