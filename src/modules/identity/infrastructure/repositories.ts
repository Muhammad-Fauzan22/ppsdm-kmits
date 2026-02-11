/**
 * Identity Infrastructure - Supabase Repository Implementation
 */

import { User, UserId, Email, UserRole, UserStatus, UserProfile } from '../domain/entities';
import { UserRepository } from '../domain/repository';
import { createClient } from '@/lib/supabase/server';

export class SupabaseUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id.getValue())
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.getValue())
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findAll(): Promise<User[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(u => this.mapToEntity(u));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(u => this.mapToEntity(u));
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(u => this.mapToEntity(u));
  }

  async save(user: User): Promise<void> {
    const supabase = await createClient();
    const profile = user['profile'];
    
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.getId().getValue(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        status: user.getStatus(),
        email_verified: user.isEmailVerified(),
        full_name: profile?.fullName,
        student_id: profile?.studentId,
        department: profile?.department,
        avatar_url: profile?.avatarUrl,
        bio: profile?.bio,
        phone_number: profile?.phoneNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async update(user: User): Promise<void> {
    const supabase = await createClient();
    const profile = user['profile'];
    
    const { error } = await supabase
      .from('users')
      .update({
        email: user.getEmail().getValue(),
        role: user.getRole(),
        status: user.getStatus(),
        email_verified: user.isEmailVerified(),
        full_name: profile?.fullName,
        student_id: profile?.studentId,
        department: profile?.department,
        avatar_url: profile?.avatarUrl,
        bio: profile?.bio,
        phone_number: profile?.phoneNumber,
        last_login_at: user['lastLoginAt']?.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.getId().getValue());

    if (error) throw error;
  }

  async delete(id: UserId): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id.getValue());

    if (error) throw error;
  }

  async count(): Promise<number> {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }

  async countByRole(role: UserRole): Promise<number> {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', role);

    if (error) throw error;
    return count || 0;
  }

  async countActive(): Promise<number> {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', UserStatus.ACTIVE);

    if (error) throw error;
    return count || 0;
  }

  private mapToEntity(data: any): User {
    const profile = new UserProfile(
      data.full_name,
      data.student_id,
      data.department,
      data.avatar_url,
      data.bio,
      data.phone_number
    );

    const user = new User(
      new UserId(data.id),
      new Email(data.email),
      { getHash: () => data.password_hash } as any, // Password hash not loaded for security
      data.role as UserRole,
      data.status as UserStatus,
      data.email_verified,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.last_login_at ? new Date(data.last_login_at) : undefined,
      profile
    );

    return user;
  }
}
