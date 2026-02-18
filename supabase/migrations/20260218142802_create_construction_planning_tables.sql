/*
  # Construction Planning Platform Database Schema

  ## Overview
  This migration creates the complete database structure for an AI-powered construction planning platform
  that handles residential projects with cost estimation, workforce allocation, and scheduling.

  ## New Tables Created

  ### 1. projects
  Stores main construction project information
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - project_name (text)
  - built_up_area (numeric) - in square feet
  - number_of_floors (integer)
  - project_timeline (integer) - in weeks
  - total_cost (numeric)
  - status (text) - draft, active, completed
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 2. project_configurations
  Stores customizable wage and material rates for each project
  - id (uuid, primary key)
  - project_id (uuid, references projects)
  - mason_wage (numeric) - per day
  - labor_wage (numeric) - per day
  - electrician_wage (numeric) - per day
  - plumber_wage (numeric) - per day
  - cement_rate (numeric) - per bag
  - steel_rate (numeric) - per kg
  - sand_rate (numeric) - per cubic meter
  - aggregate_rate (numeric) - per cubic meter
  - brick_rate (numeric) - per 1000 units
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 3. project_phases
  Stores phase-wise construction planning
  - id (uuid, primary key)
  - project_id (uuid, references projects)
  - phase_name (text) - foundation, structure, roofing, finishing
  - phase_order (integer)
  - start_week (integer)
  - duration_weeks (integer)
  - cost_estimate (numeric)
  - completion_percentage (numeric)
  - created_at (timestamptz)

  ### 4. labor_allocations
  Stores workforce requirements per phase
  - id (uuid, primary key)
  - phase_id (uuid, references project_phases)
  - worker_type (text) - mason, labor, electrician, plumber
  - quantity (integer)
  - days_required (integer)
  - created_at (timestamptz)

  ### 5. material_requirements
  Stores material quantity requirements
  - id (uuid, primary key)
  - project_id (uuid, references projects)
  - material_name (text)
  - quantity (numeric)
  - unit (text)
  - cost (numeric)
  - phase (text)
  - created_at (timestamptz)

  ### 6. weekly_schedules
  Stores week-by-week construction schedules
  - id (uuid, primary key)
  - project_id (uuid, references projects)
  - week_number (integer)
  - phase_name (text)
  - tasks (jsonb) - array of tasks for the week
  - workforce_required (jsonb) - worker types and quantities
  - materials_needed (jsonb) - materials for the week
  - created_at (timestamptz)

  ### 7. layout_suggestions
  Stores AI-generated floor layout suggestions
  - id (uuid, primary key)
  - project_id (uuid, references projects)
  - floor_number (integer)
  - layout_config (jsonb) - room configurations
  - total_rooms (integer)
  - suggestions (text)
  - created_at (timestamptz)

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Users can only access their own project data
  - Authenticated users required for all operations
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  project_name text NOT NULL,
  built_up_area numeric NOT NULL,
  number_of_floors integer NOT NULL,
  project_timeline integer NOT NULL,
  total_cost numeric DEFAULT 0,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create project_configurations table
CREATE TABLE IF NOT EXISTS project_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  mason_wage numeric DEFAULT 800,
  labor_wage numeric DEFAULT 600,
  electrician_wage numeric DEFAULT 1000,
  plumber_wage numeric DEFAULT 1000,
  cement_rate numeric DEFAULT 400,
  steel_rate numeric DEFAULT 60,
  sand_rate numeric DEFAULT 1500,
  aggregate_rate numeric DEFAULT 1800,
  brick_rate numeric DEFAULT 6000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own configurations"
  ON project_configurations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_configurations.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own configurations"
  ON project_configurations FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_configurations.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own configurations"
  ON project_configurations FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_configurations.project_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_configurations.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own configurations"
  ON project_configurations FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_configurations.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create project_phases table
CREATE TABLE IF NOT EXISTS project_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  phase_name text NOT NULL,
  phase_order integer NOT NULL,
  start_week integer NOT NULL,
  duration_weeks integer NOT NULL,
  cost_estimate numeric DEFAULT 0,
  completion_percentage numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own project phases"
  ON project_phases FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_phases.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own project phases"
  ON project_phases FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_phases.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own project phases"
  ON project_phases FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_phases.project_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_phases.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own project phases"
  ON project_phases FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_phases.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create labor_allocations table
CREATE TABLE IF NOT EXISTS labor_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid REFERENCES project_phases(id) ON DELETE CASCADE NOT NULL,
  worker_type text NOT NULL,
  quantity integer NOT NULL,
  days_required integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labor_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own labor allocations"
  ON labor_allocations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_phases
    JOIN projects ON projects.id = project_phases.project_id
    WHERE project_phases.id = labor_allocations.phase_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own labor allocations"
  ON labor_allocations FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM project_phases
    JOIN projects ON projects.id = project_phases.project_id
    WHERE project_phases.id = labor_allocations.phase_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own labor allocations"
  ON labor_allocations FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_phases
    JOIN projects ON projects.id = project_phases.project_id
    WHERE project_phases.id = labor_allocations.phase_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM project_phases
    JOIN projects ON projects.id = project_phases.project_id
    WHERE project_phases.id = labor_allocations.phase_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own labor allocations"
  ON labor_allocations FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_phases
    JOIN projects ON projects.id = project_phases.project_id
    WHERE project_phases.id = labor_allocations.phase_id
    AND projects.user_id = auth.uid()
  ));

-- Create material_requirements table
CREATE TABLE IF NOT EXISTS material_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  material_name text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  cost numeric DEFAULT 0,
  phase text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE material_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own material requirements"
  ON material_requirements FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = material_requirements.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own material requirements"
  ON material_requirements FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = material_requirements.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own material requirements"
  ON material_requirements FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = material_requirements.project_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = material_requirements.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own material requirements"
  ON material_requirements FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = material_requirements.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create weekly_schedules table
CREATE TABLE IF NOT EXISTS weekly_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  week_number integer NOT NULL,
  phase_name text NOT NULL,
  tasks jsonb DEFAULT '[]'::jsonb,
  workforce_required jsonb DEFAULT '{}'::jsonb,
  materials_needed jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly schedules"
  ON weekly_schedules FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = weekly_schedules.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own weekly schedules"
  ON weekly_schedules FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = weekly_schedules.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own weekly schedules"
  ON weekly_schedules FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = weekly_schedules.project_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = weekly_schedules.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own weekly schedules"
  ON weekly_schedules FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = weekly_schedules.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create layout_suggestions table
CREATE TABLE IF NOT EXISTS layout_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  floor_number integer NOT NULL,
  layout_config jsonb DEFAULT '{}'::jsonb,
  total_rooms integer DEFAULT 0,
  suggestions text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE layout_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own layout suggestions"
  ON layout_suggestions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = layout_suggestions.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own layout suggestions"
  ON layout_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = layout_suggestions.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own layout suggestions"
  ON layout_suggestions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = layout_suggestions.project_id
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = layout_suggestions.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own layout suggestions"
  ON layout_suggestions FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = layout_suggestions.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_configurations_project_id ON project_configurations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_labor_allocations_phase_id ON labor_allocations(phase_id);
CREATE INDEX IF NOT EXISTS idx_material_requirements_project_id ON material_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_weekly_schedules_project_id ON weekly_schedules(project_id);
CREATE INDEX IF NOT EXISTS idx_layout_suggestions_project_id ON layout_suggestions(project_id);