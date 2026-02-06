// ============================================
// ECOLOGICAL SYSTEMS THEORY - TYPE DEFINITIONS
// Based on Bronfenbrenner's Model
// ============================================

// ============================================
// CORE TYPES
// ============================================

export type SystemLayer = 'micro' | 'meso' | 'exo' | 'macro' | 'chrono';

export type StakeholderRole =
    | 'student'
    | 'lecturer'
    | 'advisor'
    | 'counselor'
    | 'org_leader'
    | 'department_head'
    | 'dean'
    | 'vice_rector'
    | 'rector'
    | 'ministry'
    | 'industry_partner'
    | 'researcher'
    | 'admin';

export interface Stakeholder {
    id: string;
    userId: string;
    role: StakeholderRole;
    systemLayer: SystemLayer;
    organization?: string;
    department?: string;
    accessLevel: number; // 1-5
    allowedFeatures: string[];
    dashboardConfig: Record<string, unknown>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface EcologicalDataPoint {
    timestamp: Date;
    studentId: string;
    systemLayer: SystemLayer;
    context: {
        environment: string;
        actors: string[];
        resources: string[];
        constraints: string[];
    };
    proximalProcesses: ProximalProcess[];
    developmentalOutcomes: DevelopmentalOutcome[];
}

export interface ProximalProcess {
    type: string;
    partners: string[];
    duration: number;
    quality: number; // 1-5
    reciprocity: number; // 1-5
    complexity: number; // 1-5
}

export interface DevelopmentalOutcome {
    dimension: string;
    change: number;
    evidence: string[];
}

// ============================================
// CHRONOSYSTEM TYPES
// ============================================

export interface ChronoSystemChange {
    id: string;
    systemLayer: SystemLayer;
    changeType: string;
    title: string;
    description?: string;
    beforeState: Record<string, unknown>;
    afterState: Record<string, unknown>;
    impactMetrics: Record<string, unknown>;
    changeDate: Date;
    initiatedBy?: string;
    approvedBy?: string;
    status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

export interface ChronoTrajectory {
    id: string;
    studentId: string;
    timePeriod: string;
    academicYear: string;
    semester: number;
    ecologicalContext: Record<string, unknown>;
    proximalProcesses: Record<string, unknown>;
    dimensionScores: Record<string, number>;
    achievements: string[];
    challenges: string[];
    supportReceived: string[];
    growthIndicators: Record<string, unknown>;
    createdAt: Date;
}

export interface ChronoPolicyEvolution {
    id: string;
    policyArea: string;
    version: number;
    title: string;
    content: Record<string, unknown>;
    effectiveDate: Date;
    endDate?: Date;
    impactMetrics: Record<string, unknown>;
    stakeholdersInvolved: string[];
    systemLayersAffected: SystemLayer[];
}

// ============================================
// MACROSYSTEM TYPES
// ============================================

export type MacroStakeholderType =
    | 'ministry'
    | 'industry'
    | 'research_institution'
    | 'ngo'
    | 'international_org';

export interface MacroStakeholder {
    id: string;
    stakeholderId: string;
    type: MacroStakeholderType;
    organizationName: string;
    country: string;
    contactInfo: Record<string, unknown>;
    partnershipLevel: 'observer' | 'partner' | 'strategic' | 'official';
    dataAccessScope: string[];
    mouExpiryDate?: Date;
}

export interface NationalBenchmark {
    id: string;
    dimension: string;
    metricName: string;
    nationalAverage: number;
    top10Percentile: number;
    bottom10Percentile: number;
    regionalData: Record<string, number>;
    year: number;
    source?: string;
}

export interface PolicyRecommendation {
    id: string;
    fromStakeholder: string;
    toSystemLayer: SystemLayer;
    recommendationType: string;
    title: string;
    content: string;
    supportingData: Record<string, unknown>;
    priorityLevel: number; // 1-5
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'implemented';
    response?: string;
}

// ============================================
// EXOSYSTEM TYPES
// ============================================

export interface InstitutionalPolicy {
    id: string;
    policyCode: string;
    title: string;
    description?: string;
    category: string;
    applicableTo: string[];
    effectiveDate: Date;
    reviewCycleMonths: number;
    metricsTracked: string[];
    complianceRequirements: Record<string, unknown>;
    createdBy?: string;
    approvedBy?: string;
    status: 'draft' | 'review' | 'approved' | 'active' | 'deprecated';
}

export type ResourceType = 'budget' | 'facilities' | 'staff' | 'technology' | 'program';

export interface ResourceAllocation {
    id: string;
    resourceType: ResourceType;
    title: string;
    amount: number;
    currency: string;
    allocatedTo: string;
    allocationPurpose?: string;
    fiscalYear: number;
    utilizationMetrics: Record<string, unknown>;
    efficiencyScore?: number;
}

export interface DepartmentMetric {
    id: string;
    department: string;
    faculty?: string;
    metricName: string;
    metricValue: number;
    targetValue?: number;
    unit?: string;
    period: string;
    trendDirection: 'improving' | 'declining' | 'stable';
}

export interface QualityAssurance {
    id: string;
    area: string;
    standardCode?: string;
    complianceLevel: number;
    auditDate: Date;
    findings: Record<string, unknown>;
    recommendations: string[];
    actionItems: Record<string, unknown>;
    nextAuditDate?: Date;
}

// ============================================
// MESOSYSTEM TYPES
// ============================================

export interface CrossSystemCoordination {
    id: string;
    fromSystem: string;
    toSystem: string;
    coordinationType: string;
    title: string;
    description?: string;
    meetingFrequency?: string;
    sharedMetrics: string[];
    participants: Record<string, unknown>;
    effectivenessScore?: number;
    lastMeetingDate?: Date;
    nextMeetingDate?: Date;
    meetingNotes?: string;
}

export interface IntegratedProject {
    id: string;
    projectCode: string;
    projectName: string;
    description?: string;
    involvedSystems: string[];
    objectives: Record<string, unknown>;
    timeline: Record<string, unknown>;
    participants: Record<string, unknown>;
    budget?: number;
    outcomes: Record<string, unknown>;
    integrationLevel: 'low' | 'medium' | 'high';
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    leadCoordinator?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface SystemAlignment {
    id: string;
    systemsCompared: string[];
    alignmentDimension: string;
    alignmentScore: number;
    misalignmentAreas: string[];
    recommendations: string[];
    actionPlan: Record<string, unknown>;
    measuredAt: Date;
    nextReviewDate?: Date;
}

export interface MesoNotification {
    id: string;
    fromSystem: string;
    toSystems: string[];
    notificationType: string;
    title: string;
    content: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    actionRequired: boolean;
    actionDeadline?: Date;
    acknowledgedBy: string[];
}

// ============================================
// MICROSYSTEM TYPES
// ============================================

// Academic System
export interface AcademicActivity {
    id: string;
    courseId: string;
    courseName: string;
    lecturerId?: string;
    activityType: 'lecture' | 'lab' | 'discussion' | 'tutorial' | 'exam' | 'project';
    ecologicalContext: Record<string, unknown>;
    proximalProcesses: Record<string, unknown>;
    learningOutcomes: string[];
    studentEngagement: Record<string, unknown>;
    resourcesUsed: string[];
    activityDate: Date;
    durationMinutes?: number;
}

export interface FacultyInteraction {
    id: string;
    facultyId: string;
    studentId: string;
    interactionType: 'advising' | 'mentoring' | 'office_hours' | 'feedback' | 'consultation';
    context?: string;
    durationMinutes?: number;
    qualityRating?: number; // 1-5
    topicsDiscussed: string[];
    actionItems: string[];
    followUpDate?: Date;
    notes?: string;
    occurredAt: Date;
}

// Organization System
export type OrganizationType = 'bem' | 'himpunan' | 'ukm' | 'community' | 'project_team';

export interface OrganizationActivity {
    id: string;
    organizationId?: string;
    organizationName: string;
    organizationType: OrganizationType;
    activityName: string;
    activityType: string;
    description?: string;
    developmentalDimensions: string[];
    participationCount: number;
    participationMetrics: Record<string, unknown>;
    impactAssessment: Record<string, unknown>;
    budget?: number;
    activityDate: Date;
}

export type NetworkType = 'academic' | 'social' | 'professional' | 'mentorship' | 'study_group';

export interface PeerNetwork {
    id: string;
    studentId: string;
    networkType: NetworkType;
    connections: Record<string, unknown>;
    networkSize: number;
    networkStrengthScore?: number;
    diversityIndex?: number;
    interactionFrequency?: string;
    keyConnections: string[];
    lastUpdated: Date;
}

// Personal Development System
export interface ProximalProcessLog {
    id: string;
    studentId: string;
    processType: string;
    partnerType?: string;
    partnerId?: string;
    ecologicalContext?: string;
    durationMinutes?: number;
    qualityScore?: number; // 1-5
    reciprocityLevel?: number; // 1-5
    complexityLevel?: number; // 1-5
    learningOutcomes: string[];
    dimensionImpacts: Record<string, number>;
    reflection?: string;
    occurredAt: Date;
}

export type TransitionType = 'planned' | 'unplanned' | 'gradual' | 'sudden' | 'normative' | 'non_normative';

export interface EcologicalTransition {
    id: string;
    studentId: string;
    fromContext: string;
    toContext: string;
    transitionType: TransitionType;
    reason?: string;
    supportNeeded: string[];
    supportReceived: string[];
    adaptationLevel?: number; // 1-5
    challengesFaced: string[];
    copingStrategies: string[];
    transitionDate: Date;
    adaptationComplete: boolean;
}

export interface PersonalEcologyMap {
    id: string;
    studentId: string;
    microsystems: {
        family: Record<string, unknown>;
        school: Record<string, unknown>;
        peers: Record<string, unknown>;
        organizations: Record<string, unknown>;
    };
    mesosystemConnections: Array<{
        system1: string;
        system2: string;
        connectionStrength: number;
        description: string;
    }>;
    exosystemInfluences: Array<{
        source: string;
        influence: string;
        impact: 'positive' | 'negative' | 'neutral';
    }>;
    macrosystemContext: {
        culturalValues: string[];
        socialNorms: string[];
        economicFactors: string[];
    };
    chronosystemEvents: Array<{
        event: string;
        date: Date;
        impact: string;
    }>;
    protectiveFactors: string[];
    riskFactors: string[];
    supportNetwork: Record<string, unknown>;
    lastUpdated: Date;
}

// ============================================
// CORE TYPES
// ============================================

export interface EcologicalEvent {
    id: string;
    eventType: string;
    systemLayer: SystemLayer;
    sourceTable: string;
    sourceId: string;
    studentId?: string;
    stakeholderId?: string;
    eventData: Record<string, unknown>;
    impactAssessment: Record<string, unknown>;
    createdAt: Date;
}

export interface SystemHealth {
    id: string;
    systemLayer: SystemLayer;
    subsystem?: string;
    healthScore: number;
    metrics: Record<string, unknown>;
    issuesDetected: string[];
    recommendations: string[];
    measuredAt: Date;
}

export interface InterventionPlan {
    id: string;
    studentId: string;
    targetOutcomes: string[];
    microsystemActions: Record<string, unknown>;
    mesosystemCoordination: Record<string, unknown>;
    exosystemSupports: Record<string, unknown>;
    timeline: Record<string, unknown>;
    progressIndicators: Record<string, unknown>;
    status: 'active' | 'paused' | 'completed' | 'cancelled';
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface EcologicalDashboardData {
    layer: SystemLayer;
    metrics: Record<string, number>;
    recentActivities: EcologicalEvent[];
    alerts: MesoNotification[];
    actionItems: Array<{
        title: string;
        priority: string;
        deadline?: Date;
    }>;
}

export interface StudentEcologicalProfile {
    student: {
        id: string;
        name: string;
        faculty: string;
        year: number;
    };
    ecologyMap: PersonalEcologyMap;
    trajectories: ChronoTrajectory[];
    proximalProcesses: ProximalProcessLog[];
    transitions: EcologicalTransition[];
    peerNetworks: PeerNetwork[];
    interventionPlans: InterventionPlan[];
}

export interface InstitutionalEcologicalReport {
    period: string;
    systemHealthScores: Record<SystemLayer, number>;
    departmentMetrics: DepartmentMetric[];
    resourceUtilization: ResourceAllocation[];
    qualityAssurance: QualityAssurance[];
    crossSystemAlignments: SystemAlignment[];
    recommendations: string[];
}
