/**
 * Assessment Infrastructure Layer
 * Repository implementations using Supabase
 */

import { Assessment, AssessmentId, Dimension, Score } from '../domain/entities';
import { AssessmentRepository, DimensionRepository } from '../domain/repository';
import { createClient } from '@/lib/supabase/server';

// Supabase Assessment Repository Implementation
export class SupabaseAssessmentRepository implements AssessmentRepository {
  async findById(id: AssessmentId): Promise<Assessment | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (*)
      `)
      .eq('id', id.getValue())
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<Assessment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((a: any) => this.mapToEntity(a));
  }

  async findCompletedByUserId(userId: string): Promise<Assessment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (*)
      `)
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (error || !data) return [];

    return data.map((a: any) => this.mapToEntity(a));
  }

  async findByDimension(dimensionId: number): Promise<Assessment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (*)
      `)
      .eq('dimension_id', dimensionId);

    if (error || !data) return [];

    return data.map((a: any) => this.mapToEntity(a));
  }

  async save(assessment: Assessment): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('assessments')
      .insert({
        id: assessment.getId().getValue(),
        user_id: assessment.getUserId(),
        dimension_id: assessment.getDimension().getId(),
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async update(assessment: Assessment): Promise<void> {
    const supabase = await createClient();

    const score = assessment.getScore();

    const { error } = await supabase
      .from('assessments')
      .update({
        score: score?.getValue(),
        completed_at: assessment.isCompleted() ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', assessment.getId().getValue());

    if (error) throw error;
  }

  async delete(id: AssessmentId): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id.getValue());

    if (error) throw error;
  }

  async getAverageScoreByDimension(dimensionId: number): Promise<number | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assessments')
      .select('score')
      .eq('dimension_id', dimensionId)
      .not('score', 'is', null);

    if (error || !data || data.length === 0) return null;

    const total = data.reduce((sum: number, a: any) => sum + (a.score || 0), 0);
    return total / data.length;
  }

  async getCompletionRate(): Promise<number> {
    const supabase = await createClient();

    const { count: total, error: totalError } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true });

    const { count: completed, error: completedError } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .not('completed_at', 'is', null);

    if (totalError || completedError || !total || total === 0) return 0;

    return (completed || 0) / total * 100;
  }

  private mapToEntity(data: any): Assessment {
    const dimension = new Dimension(
      data.dimensions.id,
      data.dimensions.name,
      data.dimensions.description,
      data.dimensions.weight
    );

    const assessment = new Assessment(
      new AssessmentId(data.id),
      data.user_id,
      dimension,
      new Date(data.started_at),
      data.completed_at ? new Date(data.completed_at) : undefined,
      data.score !== null ? new Score(data.score) : undefined
    );

    return assessment;
  }
}

// Supabase Dimension Repository Implementation
export class SupabaseDimensionRepository implements DimensionRepository {
  async findById(id: number): Promise<Dimension | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('dimensions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return this.mapToEntity(data);
  }

  async findAll(): Promise<Dimension[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('dimensions')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data) return [];

    return data.map((d: any) => this.mapToEntity(d));
  }

  async save(dimension: Dimension): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('dimensions')
      .upsert({
        id: dimension.getId(),
        name: dimension.getName(),
        description: dimension.getDescription(),
        weight: dimension.getWeight()
      });

    if (error) throw error;
  }

  private mapToEntity(data: any): Dimension {
    return new Dimension(
      data.id,
      data.name,
      data.description,
      data.weight
    );
  }
}
