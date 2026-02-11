// Multi-Tenancy Manager
// Supports white-label deployments for multiple institutions

export interface TenantBranding {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
    appName: string;
    tagline: string;
}

export interface TenantAuth {
    type: 'email_password' | 'sso' | 'ldap';
    ssoEndpoint?: string;
    ssoClientId?: string;
    ldapServer?: string;
}

export interface TenantConfig {
    id: string;
    name: string;
    shortName: string;
    domain: string;
    branding: TenantBranding;
    features: string[];
    auth: TenantAuth;
    settings: {
        allowPublicRegistration: boolean;
        requireEmailVerification: boolean;
        defaultLanguage: 'id' | 'en';
        timezone: string;
        academicYear: string;
    };
    contact: {
        email: string;
        phone?: string;
        address?: string;
    };
    active: boolean;
    createdAt: string;
}

// Default tenants
const TENANTS: Map<string, TenantConfig> = new Map([
    ['its', {
        id: 'its',
        name: 'Institut Teknologi Sepuluh Nopember',
        shortName: 'ITS',
        domain: 'ppsdm.km.its.ac.id',
        branding: {
            primaryColor: '#003366',
            secondaryColor: '#6366f1',
            logo: '/tenants/its/logo.png',
            favicon: '/tenants/its/favicon.ico',
            appName: 'PPSDM KMITS',
            tagline: 'Holistic Student Development Platform',
        },
        features: [
            'all_assessments',
            'ai_tutor',
            'analytics',
            'gamification',
            'mentorship',
            'learning_paths',
            'knowledge_base',
            'supervisor_dashboard',
        ],
        auth: {
            type: 'sso',
            ssoEndpoint: 'https://sso.its.ac.id',
            ssoClientId: process.env.ITS_SSO_CLIENT_ID || '',
        },
        settings: {
            allowPublicRegistration: false,
            requireEmailVerification: true,
            defaultLanguage: 'id',
            timezone: 'Asia/Jakarta',
            academicYear: '2025/2026',
        },
        contact: {
            email: 'ppsdm@km.its.ac.id',
            phone: '+62 31 5946822',
            address: 'Gedung Pusat Kemahasiswaan ITS, Surabaya',
        },
        active: true,
        createdAt: '2026-01-01',
    }],
    ['demo', {
        id: 'demo',
        name: 'Demo Institution',
        shortName: 'DEMO',
        domain: 'demo.ppsdm.id',
        branding: {
            primaryColor: '#10b981',
            secondaryColor: '#6366f1',
            logo: '/tenants/demo/logo.png',
            favicon: '/tenants/demo/favicon.ico',
            appName: 'PPSDM Demo',
            tagline: 'Try PPSDM Platform',
        },
        features: [
            'basic_assessments',
            'dashboard',
            'analytics',
        ],
        auth: {
            type: 'email_password',
        },
        settings: {
            allowPublicRegistration: true,
            requireEmailVerification: false,
            defaultLanguage: 'id',
            timezone: 'Asia/Jakarta',
            academicYear: '2025/2026',
        },
        contact: {
            email: 'demo@ppsdm.id',
        },
        active: true,
        createdAt: '2026-01-15',
    }],
]);

export class TenantManager {
    private static instance: TenantManager;
    private tenants: Map<string, TenantConfig>;
    private currentTenant: TenantConfig | null = null;

    private constructor() {
        this.tenants = TENANTS;
    }

    static getInstance(): TenantManager {
        if (!TenantManager.instance) {
            TenantManager.instance = new TenantManager();
        }
        return TenantManager.instance;
    }

    // Get tenant by ID
    getTenant(tenantId: string): TenantConfig | null {
        return this.tenants.get(tenantId) || null;
    }

    // Get tenant by domain
    getTenantByDomain(domain: string): TenantConfig | null {
        for (const tenant of this.tenants.values()) {
            if (tenant.domain === domain) {
                return tenant;
            }
        }
        return null;
    }

    // Get current tenant (for SSR/API context)
    getCurrentTenant(): TenantConfig | null {
        return this.currentTenant;
    }

    // Set current tenant context
    setCurrentTenant(tenantId: string): boolean {
        const tenant = this.getTenant(tenantId);
        if (tenant && tenant.active) {
            this.currentTenant = tenant;
            return true;
        }
        return false;
    }

    // Detect tenant from request
    detectTenantFromRequest(headers: Headers): TenantConfig | null {
        const host = headers.get('host') || '';

        // Check by domain
        const tenant = this.getTenantByDomain(host);
        if (tenant) return tenant;

        // Check by subdomain
        const subdomain = host.split('.')[0];
        const tenantBySubdomain = this.getTenant(subdomain);
        if (tenantBySubdomain) return tenantBySubdomain;

        // Default to ITS
        return this.getTenant('its');
    }

    // Check if tenant has a feature
    hasFeature(tenantId: string, feature: string): boolean {
        const tenant = this.getTenant(tenantId);
        return tenant?.features.includes(feature) || false;
    }

    // Get all active tenants
    getActiveTenants(): TenantConfig[] {
        return Array.from(this.tenants.values()).filter(t => t.active);
    }

    // Create new tenant (admin only)
    async createTenant(config: Omit<TenantConfig, 'createdAt'>): Promise<TenantConfig> {
        const newTenant: TenantConfig = {
            ...config,
            createdAt: new Date().toISOString(),
        };

        this.tenants.set(config.id, newTenant);

        // In production, also save to database:
        // await supabase.from('tenants').insert(newTenant);

        return newTenant;
    }

    // Update tenant configuration
    async updateTenant(tenantId: string, updates: Partial<TenantConfig>): Promise<TenantConfig | null> {
        const existing = this.getTenant(tenantId);
        if (!existing) return null;

        const updated: TenantConfig = {
            ...existing,
            ...updates,
            id: existing.id, // Prevent ID change
            createdAt: existing.createdAt, // Preserve creation date
        };

        this.tenants.set(tenantId, updated);

        // In production, also update database:
        // await supabase.from('tenants').update(updates).eq('id', tenantId);

        return updated;
    }

    // Get branding CSS variables
    getBrandingCSSVariables(tenantId: string): Record<string, string> {
        const tenant = this.getTenant(tenantId);
        if (!tenant) return {};

        return {
            '--primary-color': tenant.branding.primaryColor,
            '--secondary-color': tenant.branding.secondaryColor,
            '--app-name': `"${tenant.branding.appName}"`,
        };
    }
}

// React hook for tenant context
export function useTenant(): TenantConfig | null {
    if (typeof window === 'undefined') {
        return TenantManager.getInstance().getCurrentTenant();
    }

    // Client-side: detect from window.location
    const manager = TenantManager.getInstance();
    const tenant = manager.getTenantByDomain(window.location.host);
    return tenant || manager.getTenant('its');
}

// Get tenant-specific configuration
export function getTenantConfig(tenantId: string = 'its'): TenantConfig | null {
    return TenantManager.getInstance().getTenant(tenantId);
}

// Check feature access for tenant
export function tenantHasFeature(tenantId: string, feature: string): boolean {
    return TenantManager.getInstance().hasFeature(tenantId, feature);
}

// White-label partner onboarding data
export interface PartnerOnboardingData {
    institution: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    estimatedStudents: number;
    desiredDomain: string;
    features: string[];
    customBranding: boolean;
    ssoRequired: boolean;
    additionalNotes: string;
}

export async function submitPartnerOnboarding(data: PartnerOnboardingData): Promise<{ success: boolean; message: string }> {
    // Validate data
    if (!data.institution || !data.contactEmail) {
        return { success: false, message: 'Missing required fields' };
    }

    // In production, save to database and send notification
    // Mock success response
    return {
        success: true,
        message: 'Terima kasih! Tim kami akan menghubungi Anda dalam 1-2 hari kerja.',
    };
}

export default TenantManager;
