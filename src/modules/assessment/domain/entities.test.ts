import { describe, it, expect } from 'vitest';
import {
  Assessment,
  AssessmentId,
  Dimension,
  Score,
  UserAssessmentAggregate,
  AssessmentCompletedEvent,
  AssessmentStartedEvent
} from './entities';

describe('AssessmentId', () => {
  it('should create valid AssessmentId', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const id = new AssessmentId(validUUID);
    expect(id.getValue()).toBe(validUUID);
  });

  it('should throw error for invalid UUID', () => {
    expect(() => new AssessmentId('invalid-uuid')).toThrow('Invalid Assessment ID');
    expect(() => new AssessmentId('')).toThrow('Invalid Assessment ID');
  });

  it('should compare equality correctly', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id1 = new AssessmentId(uuid);
    const id2 = new AssessmentId(uuid);
    expect(id1.equals(id2)).toBe(true);
  });

  it('should detect different IDs', () => {
    const id1 = new AssessmentId('550e8400-e29b-41d4-a716-446655440000');
    const id2 = new AssessmentId('550e8400-e29b-41d4-a716-446655440001');
    expect(id1.equals(id2)).toBe(false);
  });
});

describe('Dimension', () => {
  it('should create dimension with valid weight', () => {
    const dimension = new Dimension(1, 'Test Dimension', 'Description', 0.5);
    expect(dimension.getId()).toBe(1);
    expect(dimension.getName()).toBe('Test Dimension');
    expect(dimension.getDescription()).toBe('Description');
    expect(dimension.getWeight()).toBe(0.5);
  });

  it('should throw error for weight > 1', () => {
    expect(() => new Dimension(1, 'Test', 'Desc', 1.5)).toThrow('Weight must be between 0 and 1');
  });

  it('should throw error for negative weight', () => {
    expect(() => new Dimension(1, 'Test', 'Desc', -0.5)).toThrow('Weight must be between 0 and 1');
  });
});

describe('Score', () => {
  it('should create valid score', () => {
    const score = new Score(85);
    expect(score.getValue()).toBe(85);
  });

  it('should throw error for score > 100', () => {
    expect(() => new Score(101)).toThrow('Score must be between 0 and 100');
  });

  it('should throw error for negative score', () => {
    expect(() => new Score(-1)).toThrow('Score must be between 0 and 100');
  });

  describe('getGrade', () => {
    it('should return A for score >= 90', () => {
      expect(new Score(90).getGrade()).toBe('A');
      expect(new Score(95).getGrade()).toBe('A');
    });

    it('should return B for score >= 80', () => {
      expect(new Score(80).getGrade()).toBe('B');
      expect(new Score(85).getGrade()).toBe('B');
    });

    it('should return C for score >= 70', () => {
      expect(new Score(70).getGrade()).toBe('C');
      expect(new Score(75).getGrade()).toBe('C');
    });

    it('should return D for score >= 60', () => {
      expect(new Score(60).getGrade()).toBe('D');
      expect(new Score(65).getGrade()).toBe('D');
    });

    it('should return F for score < 60', () => {
      expect(new Score(59).getGrade()).toBe('F');
      expect(new Score(0).getGrade()).toBe('F');
    });
  });

  describe('isPassing', () => {
    it('should return true for passing scores', () => {
      expect(new Score(60).isPassing()).toBe(true);
      expect(new Score(100).isPassing()).toBe(true);
    });

    it('should return false for failing scores', () => {
      expect(new Score(59).isPassing()).toBe(false);
      expect(new Score(0).isPassing()).toBe(false);
    });
  });
});

describe('Assessment', () => {
  const createTestAssessment = () => {
    const id = new AssessmentId('550e8400-e29b-41d4-a716-446655440000');
    const dimension = new Dimension(1, 'Test', 'Description', 0.5);
    return Assessment.create(id, 'user-123', dimension);
  };

  it('should create assessment with factory method', () => {
    const assessment = createTestAssessment();
    expect(assessment.getUserId()).toBe('user-123');
    expect(assessment.isCompleted()).toBe(false);
    expect(assessment.getScore()).toBeUndefined();
  });

  it('should emit AssessmentStartedEvent on creation', () => {
    const assessment = createTestAssessment();
    const events = assessment.getDomainEvents();
    
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(AssessmentStartedEvent);
    expect(events[0]).toMatchObject({
      userId: 'user-123',
      dimensionId: 1
    });
  });

  it('should complete assessment with score', () => {
    const assessment = createTestAssessment();
    const score = new Score(85);
    
    assessment.complete(score);
    
    expect(assessment.isCompleted()).toBe(true);
    expect(assessment.getScore()?.getValue()).toBe(85);
  });

  it('should emit AssessmentCompletedEvent on completion', () => {
    const assessment = createTestAssessment();
    const score = new Score(85);
    
    assessment.complete(score);
    const events = assessment.getDomainEvents();
    
    const completedEvent = events.find(e => e instanceof AssessmentCompletedEvent);
    expect(completedEvent).toBeDefined();
    expect(completedEvent).toMatchObject({
      userId: 'user-123',
      totalScore: score
    });
  });

  it('should throw error when completing already completed assessment', () => {
    const assessment = createTestAssessment();
    assessment.complete(new Score(85));
    
    expect(() => assessment.complete(new Score(90))).toThrow('Assessment already completed');
  });

  it('should clear events', () => {
    const assessment = createTestAssessment();
    expect(assessment.getDomainEvents()).toHaveLength(1);
    
    assessment.clearEvents();
    expect(assessment.getDomainEvents()).toHaveLength(0);
  });
});

describe('UserAssessmentAggregate', () => {
  const createCompletedAssessment = (score: number, dimensionId: number = 1) => {
    const id = new AssessmentId(`550e8400-e29b-41d4-a716-44665544000${dimensionId}`);
    const dimension = new Dimension(dimensionId, 'Test', 'Desc', 0.5);
    const assessment = Assessment.create(id, 'user-123', dimension);
    assessment.complete(new Score(score));
    return assessment;
  };

  it('should add assessments', () => {
    const aggregate = new UserAssessmentAggregate('user-123');
    const assessment = createCompletedAssessment(85);
    
    aggregate.addAssessment(assessment);
    
    expect(aggregate.getCompletedAssessments()).toHaveLength(1);
  });

  it('should calculate average score', () => {
    const aggregate = new UserAssessmentAggregate('user-123');
    aggregate.addAssessment(createCompletedAssessment(80));
    aggregate.addAssessment(createCompletedAssessment(90));
    
    expect(aggregate.getAverageScore()).toBe(85);
  });

  it('should return null for average score with no completed assessments', () => {
    const aggregate = new UserAssessmentAggregate('user-123');
    expect(aggregate.getAverageScore()).toBeNull();
  });

  it('should calculate progress percentage', () => {
    const aggregate = new UserAssessmentAggregate('user-123');
    
    // Add 2 completed and 1 incomplete assessment
    aggregate.addAssessment(createCompletedAssessment(80, 1));
    aggregate.addAssessment(createCompletedAssessment(90, 2));
    
    const incompleteDimension = new Dimension(3, 'Test3', 'Desc', 0.5);
    const incompleteAssessment = Assessment.create(
      new AssessmentId('550e8400-e29b-41d4-a716-446655440003'),
      'user-123',
      incompleteDimension
    );
    aggregate.addAssessment(incompleteAssessment);
    
    expect(aggregate.getProgress()).toBe((2 / 3) * 100);
  });

  it('should return 0 progress with no assessments', () => {
    const aggregate = new UserAssessmentAggregate('user-123');
    expect(aggregate.getProgress()).toBe(0);
  });

  it('should return 100 progress when all completed', () => {
    const aggregate = new UserAssessmentAggregate('user-123');
    aggregate.addAssessment(createCompletedAssessment(80, 1));
    aggregate.addAssessment(createCompletedAssessment(90, 2));
    
    expect(aggregate.getProgress()).toBe(100);
  });
});