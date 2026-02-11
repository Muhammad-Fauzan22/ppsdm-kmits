/**
 * Identity Domain - User Management and Authentication
 */

// Value Objects
export class UserId {
  constructor(private readonly value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new Error('Invalid User ID');
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}

export class Email {
  constructor(private readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  isInstitutionalEmail(): boolean {
    const institutionalDomains = ['student.its.ac.id', 'its.ac.id', 'lecturer.its.ac.id'];
    return institutionalDomains.includes(this.getDomain());
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}

export class Password {
  constructor(private readonly hash: string) {}

  static validateStrength(password: string): boolean {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  }

  getHash(): string {
    return this.hash;
  }
}

// Domain Events
export interface DomainEvent {
  occurredOn: Date;
}

export class UserRegisteredEvent implements DomainEvent {
  occurredOn: Date = new Date();
  
  constructor(
    public readonly userId: UserId,
    public readonly email: Email
  ) {}
}

export class UserAuthenticatedEvent implements DomainEvent {
  occurredOn: Date = new Date();
  
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly method: 'password' | 'oauth' | 'magic_link'
  ) {}
}

export class PasswordChangedEvent implements DomainEvent {
  occurredOn: Date = new Date();
  
  constructor(
    public readonly userId: UserId
  ) {}
}

// Entity
export enum UserRole {
  STUDENT = 'student',
  LECTURER = 'lecturer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export class User {
  private events: DomainEvent[] = [];

  constructor(
    private id: UserId,
    private email: Email,
    private password: Password,
    private role: UserRole,
    private status: UserStatus,
    private emailVerified: boolean,
    private createdAt: Date,
    private updatedAt: Date,
    private lastLoginAt?: Date,
    private profile?: UserProfile
  ) {}

  // Factory method
  static create(
    id: UserId,
    email: Email,
    passwordHash: string,
    role: UserRole = UserRole.STUDENT
  ): User {
    const user = new User(
      id,
      email,
      new Password(passwordHash),
      role,
      UserStatus.PENDING_VERIFICATION,
      false,
      new Date(),
      new Date()
    );

    user.addEvent(new UserRegisteredEvent(id, email));
    return user;
  }

  authenticate(method: 'password' | 'oauth' | 'magic_link'): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
    
    this.addEvent(new UserAuthenticatedEvent(
      this.id,
      this.email,
      method
    ));
  }

  changePassword(newPasswordHash: string): void {
    this.password = new Password(newPasswordHash);
    this.updatedAt = new Date();
    
    this.addEvent(new PasswordChangedEvent(this.id));
  }

  verifyEmail(): void {
    this.emailVerified = true;
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  suspend(): void {
    this.status = UserStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  updateProfile(profile: UserProfile): void {
    this.profile = profile;
    this.updatedAt = new Date();
  }

  // Getters
  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getRole(): UserRole {
    return this.role;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPER_ADMIN;
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  private addEvent(event: DomainEvent): void {
    this.events.push(event);
  }
}

// User Profile Value Object
export class UserProfile {
  constructor(
    public readonly fullName: string,
    public readonly studentId?: string,
    public readonly department?: string,
    public readonly avatarUrl?: string,
    public readonly bio?: string,
    public readonly phoneNumber?: string
  ) {}
}

// Permission Entity
export class Permission {
  constructor(
    private id: string,
    private name: string,
    private resource: string,
    private action: 'create' | 'read' | 'update' | 'delete' | 'manage'
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  canAccess(resource: string, action: string): boolean {
    return this.resource === resource && this.action === action;
  }
}
