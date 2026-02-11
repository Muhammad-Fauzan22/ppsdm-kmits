/**
 * Identity Repository Interface
 */

import { User, UserId, Email, UserRole, UserStatus, Permission } from './entities';

export interface UserRepository {
  // Queries
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  findByStatus(status: UserStatus): Promise<User[]>;
  
  // Commands
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  
  // Statistics
  count(): Promise<number>;
  countByRole(role: UserRole): Promise<number>;
  countActive(): Promise<number>;
}

export interface PermissionRepository {
  findByUserId(userId: UserId): Promise<Permission[]>;
  findByRole(role: UserRole): Promise<Permission[]>;
  assignToUser(userId: UserId, permissionId: string): Promise<void>;
  revokeFromUser(userId: UserId, permissionId: string): Promise<void>;
}
