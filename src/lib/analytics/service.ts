import { createClient } from '@/lib/supabase/client';

export interface AnalyticsSummary {
    total_students: number;
    active_users_7d: number;
    avg_xp: number;
    quest_completion_rate: number;
}

export interface DepartmentStat {
    name: string;
    count: number;
}

export class AnalyticsService {
    static async getSummary(): Promise<AnalyticsSummary> {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('get_analytics_summary');

        if (error) {
            console.error('Error fetching analytics summary:', error);
            // Return fallback data if RPC fails or not yet applied
            return {
                total_students: 0,
                active_users_7d: 0,
                avg_xp: 0,
                quest_completion_rate: 0
            };
        }

        return data as AnalyticsSummary;
    }

    static async getDepartmentStats(): Promise<DepartmentStat[]> {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('get_department_stats');

        if (error) {
            console.error('Error fetching department stats:', error);
            return [];
        }

        return data as DepartmentStat[];
    }
}
