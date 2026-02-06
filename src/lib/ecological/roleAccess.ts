// ============================================
// ECOLOGICAL SYSTEMS - ROLE-BASED ACCESS CONTROL
// Multi-layered stakeholder access management
// ============================================

import { SystemLayer, StakeholderRole } from './types';

// ============================================
// ACCESS LEVEL DEFINITIONS
// ============================================

export type AccessLevel = 1 | 2 | 3 | 4 | 5;

export interface RoleConfig {
    role: StakeholderRole;
    layer: SystemLayer;
    accessLevel: AccessLevel;
    allowedLayers: SystemLayer[];
    features: string[];
    dataScope: 'own' | 'department' | 'faculty' | 'institution' | 'national';
    canWrite: boolean;
    canApprove: boolean;
    canExport: boolean;
}

// ============================================
// ROLE CONFIGURATIONS
// ============================================

export const ROLE_CONFIGS: Record<StakeholderRole, RoleConfig> = {
    // MICROSYSTEM ROLES
    student: {
        role: 'student',
        layer: 'micro',
        accessLevel: 1,
        allowedLayers: ['micro'],
        features: [
            'personal_dashboard',
            'assessment',
            'ai_tutor',
            'learning_paths',
            'peer_network',
            'ecology_map',
            'proximal_process_log',
            'goals',
            'achievements',
        ],
        dataScope: 'own',
        canWrite: true,
        canApprove: false,
        canExport: false,
    },

    lecturer: {
        role: 'lecturer',
        layer: 'micro',
        accessLevel: 2,
        allowedLayers: ['micro', 'meso'],
        features: [
            'class_analytics',
            'student_progress',
            'course_management',
            'faculty_interactions',
            'advising',
            'academic_activities',
            'assessment_results',
            'engagement_metrics',
        ],
        dataScope: 'department',
        canWrite: true,
        canApprove: false,
        canExport: true,
    },

    advisor: {
        role: 'advisor',
        layer: 'micro',
        accessLevel: 2,
        allowedLayers: ['micro', 'meso'],
        features: [
            'advisee_dashboard',
            'student_trajectories',
            'intervention_plans',
            'ecology_maps_view',
            'counseling_notes',
            'referral_system',
            'early_warning',
        ],
        dataScope: 'department',
        canWrite: true,
        canApprove: false,
        canExport: true,
    },

    counselor: {
        role: 'counselor',
        layer: 'micro',
        accessLevel: 3,
        allowedLayers: ['micro', 'meso', 'exo'],
        features: [
            'counseling_dashboard',
            'student_wellbeing',
            'crisis_management',
            'intervention_plans',
            'referrals',
            'mental_health_tracking',
            'support_network',
            'confidential_notes',
        ],
        dataScope: 'institution',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },

    org_leader: {
        role: 'org_leader',
        layer: 'micro',
        accessLevel: 2,
        allowedLayers: ['micro', 'meso'],
        features: [
            'organization_dashboard',
            'member_management',
            'activity_planning',
            'impact_assessment',
            'budget_request',
            'event_management',
            'collaboration_tools',
        ],
        dataScope: 'department',
        canWrite: true,
        canApprove: false,
        canExport: true,
    },

    // MESOSYSTEM ROLES
    department_head: {
        role: 'department_head',
        layer: 'meso',
        accessLevel: 3,
        allowedLayers: ['micro', 'meso', 'exo'],
        features: [
            'department_analytics',
            'staff_management',
            'curriculum_oversight',
            'resource_requests',
            'cross_system_coordination',
            'quality_metrics',
            'faculty_interactions_view',
            'student_aggregates',
        ],
        dataScope: 'department',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },

    // EXOSYSTEM ROLES
    dean: {
        role: 'dean',
        layer: 'exo',
        accessLevel: 4,
        allowedLayers: ['micro', 'meso', 'exo'],
        features: [
            'faculty_dashboard',
            'department_comparison',
            'resource_allocation',
            'policy_implementation',
            'quality_assurance',
            'strategic_planning',
            'faculty_metrics',
            'accreditation_data',
        ],
        dataScope: 'faculty',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },

    vice_rector: {
        role: 'vice_rector',
        layer: 'exo',
        accessLevel: 4,
        allowedLayers: ['micro', 'meso', 'exo', 'macro'],
        features: [
            'institutional_dashboard',
            'cross_faculty_analytics',
            'policy_development',
            'resource_oversight',
            'external_relations',
            'benchmarking',
            'strategic_initiatives',
        ],
        dataScope: 'institution',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },

    rector: {
        role: 'rector',
        layer: 'exo',
        accessLevel: 5,
        allowedLayers: ['micro', 'meso', 'exo', 'macro', 'chrono'],
        features: [
            'executive_dashboard',
            'institutional_overview',
            'policy_approval',
            'budget_approval',
            'national_benchmarking',
            'partnership_management',
            'strategic_direction',
            'historical_analysis',
        ],
        dataScope: 'institution',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },

    // MACROSYSTEM ROLES
    ministry: {
        role: 'ministry',
        layer: 'macro',
        accessLevel: 5,
        allowedLayers: ['macro', 'chrono'],
        features: [
            'national_dashboard',
            'institution_comparison',
            'policy_recommendations',
            'benchmark_data',
            'aggregated_analytics',
            'research_data',
            'compliance_monitoring',
        ],
        dataScope: 'national',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },

    industry_partner: {
        role: 'industry_partner',
        layer: 'macro',
        accessLevel: 3,
        allowedLayers: ['macro'],
        features: [
            'partnership_dashboard',
            'skill_analytics',
            'talent_pipeline',
            'collaboration_projects',
            'industry_insights',
            'recruitment_data',
        ],
        dataScope: 'institution',
        canWrite: false,
        canApprove: false,
        canExport: true,
    },

    researcher: {
        role: 'researcher',
        layer: 'macro',
        accessLevel: 3,
        allowedLayers: ['macro', 'chrono'],
        features: [
            'research_dashboard',
            'anonymized_data',
            'longitudinal_data',
            'statistical_tools',
            'data_export',
            'methodology_docs',
        ],
        dataScope: 'national',
        canWrite: false,
        canApprove: false,
        canExport: true,
    },

    admin: {
        role: 'admin',
        layer: 'exo',
        accessLevel: 5,
        allowedLayers: ['micro', 'meso', 'exo', 'macro', 'chrono'],
        features: ['all'],
        dataScope: 'institution',
        canWrite: true,
        canApprove: true,
        canExport: true,
    },
};

// ============================================
// ACCESS CONTROL FUNCTIONS
// ============================================

export function getRoleConfig(role: StakeholderRole): RoleConfig {
    return ROLE_CONFIGS[role];
}

export function canAccessLayer(role: StakeholderRole, layer: SystemLayer): boolean {
    const config = ROLE_CONFIGS[role];
    return config.allowedLayers.includes(layer);
}

export function canAccessFeature(role: StakeholderRole, feature: string): boolean {
    const config = ROLE_CONFIGS[role];
    return config.features.includes('all') || config.features.includes(feature);
}

export function getAccessLevel(role: StakeholderRole): AccessLevel {
    return ROLE_CONFIGS[role].accessLevel;
}

export function canWriteData(role: StakeholderRole): boolean {
    return ROLE_CONFIGS[role].canWrite;
}

export function canApproveActions(role: StakeholderRole): boolean {
    return ROLE_CONFIGS[role].canApprove;
}

export function canExportData(role: StakeholderRole): boolean {
    return ROLE_CONFIGS[role].canExport;
}

export function getDataScope(role: StakeholderRole): string {
    return ROLE_CONFIGS[role].dataScope;
}

// ============================================
// ROUTE PROTECTION
// ============================================

export const PROTECTED_ROUTES: Record<string, {
    minAccessLevel: AccessLevel;
    allowedRoles: StakeholderRole[];
    requiredFeatures: string[];
}> = {
    // Student routes
    '/dashboard': {
        minAccessLevel: 1,
        allowedRoles: ['student', 'lecturer', 'advisor', 'counselor', 'admin'],
        requiredFeatures: ['personal_dashboard'],
    },
    '/ai-tutor': {
        minAccessLevel: 1,
        allowedRoles: ['student', 'admin'],
        requiredFeatures: ['ai_tutor'],
    },
    '/assessment': {
        minAccessLevel: 1,
        allowedRoles: ['student', 'admin'],
        requiredFeatures: ['assessment'],
    },

    // Lecturer routes
    '/lecturer': {
        minAccessLevel: 2,
        allowedRoles: ['lecturer', 'department_head', 'dean', 'admin'],
        requiredFeatures: ['class_analytics'],
    },
    '/lecturer/courses': {
        minAccessLevel: 2,
        allowedRoles: ['lecturer', 'department_head', 'admin'],
        requiredFeatures: ['course_management'],
    },

    // Organization routes
    '/organization': {
        minAccessLevel: 2,
        allowedRoles: ['org_leader', 'counselor', 'admin'],
        requiredFeatures: ['organization_dashboard'],
    },

    // Department routes
    '/department': {
        minAccessLevel: 3,
        allowedRoles: ['department_head', 'dean', 'vice_rector', 'rector', 'admin'],
        requiredFeatures: ['department_analytics'],
    },

    // Faculty routes
    '/faculty': {
        minAccessLevel: 4,
        allowedRoles: ['dean', 'vice_rector', 'rector', 'admin'],
        requiredFeatures: ['faculty_dashboard'],
    },

    // Institutional routes
    '/admin/rector': {
        minAccessLevel: 5,
        allowedRoles: ['rector', 'vice_rector', 'admin'],
        requiredFeatures: ['executive_dashboard'],
    },
    '/admin/policies': {
        minAccessLevel: 4,
        allowedRoles: ['dean', 'vice_rector', 'rector', 'admin'],
        requiredFeatures: ['policy_implementation'],
    },

    // Ministry routes
    '/ministry': {
        minAccessLevel: 5,
        allowedRoles: ['ministry', 'admin'],
        requiredFeatures: ['national_dashboard'],
    },

    // Research routes
    '/research': {
        minAccessLevel: 3,
        allowedRoles: ['researcher', 'ministry', 'admin'],
        requiredFeatures: ['research_dashboard'],
    },
};

export function canAccessRoute(
    role: StakeholderRole,
    route: string
): { allowed: boolean; reason?: string } {
    const config = PROTECTED_ROUTES[route];

    if (!config) {
        return { allowed: true }; // Public route
    }

    const roleConfig = ROLE_CONFIGS[role];

    // Check access level
    if (roleConfig.accessLevel < config.minAccessLevel) {
        return {
            allowed: false,
            reason: `Requires access level ${config.minAccessLevel}, you have ${roleConfig.accessLevel}`
        };
    }

    // Check allowed roles
    if (!config.allowedRoles.includes(role)) {
        return {
            allowed: false,
            reason: `Role '${role}' not permitted for this route`
        };
    }

    // Check required features
    for (const feature of config.requiredFeatures) {
        if (!canAccessFeature(role, feature)) {
            return {
                allowed: false,
                reason: `Missing required feature: ${feature}`
            };
        }
    }

    return { allowed: true };
}

// ============================================
// API RATE LIMITS BY ROLE
// ============================================

export const RATE_LIMITS: Record<SystemLayer, {
    requestsPerMinute: number;
    requestsPerDay: number;
}> = {
    micro: { requestsPerMinute: 100, requestsPerDay: 5000 },
    meso: { requestsPerMinute: 200, requestsPerDay: 10000 },
    exo: { requestsPerMinute: 500, requestsPerDay: 20000 },
    macro: { requestsPerMinute: 100, requestsPerDay: 1000 },
    chrono: { requestsPerMinute: 50, requestsPerDay: 500 },
};

export function getRateLimit(layer: SystemLayer) {
    return RATE_LIMITS[layer];
}

// ============================================
// DATA ANONYMIZATION RULES
// ============================================

export const ANONYMIZATION_RULES: Record<string, {
    fields: string[];
    method: 'hash' | 'remove' | 'aggregate' | 'mask';
}> = {
    student_export: {
        fields: ['name', 'email', 'nim', 'phone'],
        method: 'hash',
    },
    national_benchmark: {
        fields: ['student_id', 'name', 'email'],
        method: 'remove',
    },
    research_data: {
        fields: ['name', 'email', 'phone', 'address'],
        method: 'remove',
    },
    department_aggregate: {
        fields: ['student_id'],
        method: 'aggregate',
    },
};

const roleAccess = {
    ROLE_CONFIGS,
    PROTECTED_ROUTES,
    RATE_LIMITS,
    ANONYMIZATION_RULES,
    getRoleConfig,
    canAccessLayer,
    canAccessFeature,
    canAccessRoute,
    getAccessLevel,
    canWriteData,
    canApproveActions,
    canExportData,
    getDataScope,
    getRateLimit,
};

export default roleAccess;
