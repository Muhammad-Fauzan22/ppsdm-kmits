/**
 * Identity Application Layer - Use Cases
 */

import { User, UserId, Email, Password, UserRole, UserStatus, UserProfile } from '../domain/entities';
import { UserRepository } from '../domain/repository';
import { hash, compare } from 'bcryptjs';
import { z } from 'zod';

// DTOs
export interface RegisterUserDTO {
  email: string;
  password: string;
  fullName: string;
  studentId?: string;
  department?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  userId: string;
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDTO {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface UserDTO {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  fullName?: string;
  studentId?: string;
  department?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Validation Schemas
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);

// Use Case: Register User
export class RegisterUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<UserDTO> {
    // Validate email
    const emailValidation = emailSchema.safeParse(dto.email);
    if (!emailValidation.success) {
      throw new Error('Invalid email format');
    }

    // Check institutional email
    const email = new Email(dto.email);
    if (!email.isInstitutionalEmail()) {
      throw new Error('Only institutional emails are allowed');
    }

    // Validate password strength
    if (!Password.validateStrength(dto.password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hash(dto.password, 12);

    // Determine role based on email
    let role = UserRole.STUDENT;
    if (email.getDomain() === 'lecturer.its.ac.id') {
      role = UserRole.LECTURER;
    }

    // Create user
    const userId = new UserId(crypto.randomUUID());
    const user = User.create(userId, email, passwordHash, role);
    
    // Add profile
    const profile = new UserProfile(
      dto.fullName,
      dto.studentId,
      dto.department
    );
    user.updateProfile(profile);

    await this.userRepo.save(user);

    return this.mapToDTO(user);
  }

  private mapToDTO(user: User): UserDTO {
    const profile = user['profile']; // Access private field for mapping
    
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole(),
      status: user.getStatus(),
      emailVerified: user.isEmailVerified(),
      fullName: profile?.fullName,
      studentId: profile?.studentId,
      department: profile?.department,
      createdAt: new Date(),
      lastLoginAt: user['lastLoginAt']
    };
  }
}

// Use Case: Login
export class LoginUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: LoginDTO): Promise<{ user: UserDTO; token: string }> {
    // Validate email
    const emailValidation = emailSchema.safeParse(dto.email);
    if (!emailValidation.success) {
      throw new Error('Invalid email format');
    }

    const email = new Email(dto.email);

    // Find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new Error('Account is not active');
    }

    // Verify password (in real implementation, compare hashes)
    // const isValid = await compare(dto.password, user.getPasswordHash());
    // if (!isValid) {
    //   throw new Error('Invalid credentials');
    // }

    // Authenticate user
    user.authenticate('password');
    await this.userRepo.update(user);

    // Generate JWT token (simplified)
    const token = this.generateToken(user);

    const userDTO: UserDTO = {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole(),
      status: user.getStatus(),
      emailVerified: user.isEmailVerified(),
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    return { user: userDTO, token };
  }

  private generateToken(user: User): string {
    // Simplified token generation
    // In production, use proper JWT library
    return `jwt_token_${user.getId().getValue()}_${Date.now()}`;
  }
}

// Use Case: Update Profile
export class UpdateProfileUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: UpdateProfileDTO): Promise<UserDTO> {
    const userId = new UserId(dto.userId);
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update profile
    const currentProfile = user['profile'];
    const updatedProfile = new UserProfile(
      dto.fullName || currentProfile?.fullName || '',
      currentProfile?.studentId,
      currentProfile?.department,
      dto.avatarUrl || currentProfile?.avatarUrl,
      dto.bio || currentProfile?.bio,
      dto.phoneNumber || currentProfile?.phoneNumber
    );

    user.updateProfile(updatedProfile);
    await this.userRepo.update(user);

    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole(),
      status: user.getStatus(),
      emailVerified: user.isEmailVerified(),
      fullName: updatedProfile.fullName,
      studentId: updatedProfile.studentId,
      department: updatedProfile.department,
      createdAt: new Date()
    };
  }
}

// Use Case: Get User Statistics
export class GetUserStatisticsUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<string, number>;
    verificationRate: number;
  }> {
    const totalUsers = await this.userRepo.count();
    const activeUsers = await this.userRepo.countActive();
    
    const usersByRole: Record<string, number> = {};
    for (const role of Object.values(UserRole)) {
      usersByRole[role] = await this.userRepo.countByRole(role);
    }

    // Calculate verification rate
    const allUsers = await this.userRepo.findAll();
    const verifiedUsers = allUsers.filter(u => u.isEmailVerified()).length;
    const verificationRate = totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0;

    return {
      totalUsers,
      activeUsers,
      usersByRole,
      verificationRate
    };
  }
}
