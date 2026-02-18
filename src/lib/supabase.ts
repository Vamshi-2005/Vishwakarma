import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          project_name: string;
          built_up_area: number;
          number_of_floors: number;
          project_timeline: number;
          total_cost: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      project_configurations: {
        Row: {
          id: string;
          project_id: string;
          mason_wage: number;
          labor_wage: number;
          electrician_wage: number;
          plumber_wage: number;
          cement_rate: number;
          steel_rate: number;
          sand_rate: number;
          aggregate_rate: number;
          brick_rate: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
