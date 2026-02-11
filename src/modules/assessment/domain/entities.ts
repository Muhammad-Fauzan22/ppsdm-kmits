/**
 * Assessment Domain - Entities and Value Objects
 * This represents the core business logic of the assessment module
 */

// Value Objects
export class AssessmentId {
  constructor(private readonly value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new Error('Invalid Assessment ID');
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: AssessmentId): boolean {
    return this.value === other.value;
  }
}

export class Dimension {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly description: string,
    private readonly weight: number
  ) {
    if (weight < 0 || weight > 1) {
      throw new Error('Weight must be between 0 and 1');
    }
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getWeight(): number {
    return this.weight;
  }
}

export class Score {
  constructor(private readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Score must be between 0 and 100');
    }
  }

  getValue(): number {
    return this.value;
  }

  getGrade(): string {
    if (this.value >= 90) return 'A';
    if (this.value >= 80) return 'B';
    if (this.value >= 70) return 'C';
    if (this.value >= 60) return 'D';
    return 'F';
  }

  isPassing(): boolean {
    return this.value >= 60;
  }
}

// Domain Events
export interface DomainEvent {
  occurredOn: Date;
}

export class AssessmentCompletedEvent implements DomainEvent {
  occurredOn: Date = new Date();
  
  constructor(
    public readonly assessmentId: AssessmentId,
    public readonly userId: string,
    public readonly totalScore: Score
  ) {}
}

export class AssessmentStartedEvent implements DomainEvent {
  occurredOn: Date = new Date();
  
  constructor(
    public readonly assessmentId: AssessmentId,
    public readonly userId: string,
    public readonly dimensionId: number
  ) {}
}

// Entity
export class Assessment {
  private events: DomainEvent[] = [];

  constructor(
    private id: AssessmentId,
    private userId: string,
    private dimension: Dimension,
    private startedAt: Date,
    private completedAt?: Date,
    private score?: Score
  ) {}

  // Factory method
  static create(
    id: AssessmentId,
    userId: string,
    dimension: Dimension
  ): Assessment {
    const assessment = new Assessment(id, userId, dimension, new Date());
    assessment.addEvent(new AssessmentStartedEvent(id, userId, dimension.getId()));
    return assessment;
  }

  complete(score: Score): void {
    if (this.completedAt) {
      throw new Error('Assessment already completed');
    }

    this.score = score;
    this.completedAt = new Date();
    
    this.addEvent(new AssessmentCompletedEvent(
      this.id,
      this.userId,
      score
    ));
  }

  getId(): AssessmentId {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getDimension(): Dimension {
    return this.dimension;
  }

  getScore(): Score | undefined {
    return this.score;
  }

  isCompleted(): boolean {
    return !!this.completedAt;
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

// Aggregate Root
export class UserAssessmentAggregate {
  private assessments: Assessment[] = [];

  constructor(private userId: string) {}

  addAssessment(assessment: Assessment): void {
    this.assessments.push(assessment);
  }

  getCompletedAssessments(): Assessment[] {
    return this.assessments.filter(a => a.isCompleted());
  }

  getAverageScore(): number | null {
    const completed = this.getCompletedAssessments();
    if (completed.length === 0) return null;

    const total = completed.reduce((sum, a) => {
      const score = a.getScore();
      return sum + (score ? score.getValue() : 0);
    }, 0);

    return total / completed.length;
  }

  getProgress(): number {
    if (this.assessments.length === 0) return 0;
    return (this.getCompletedAssessments().length / this.assessments.length) * 100;
  }
}
