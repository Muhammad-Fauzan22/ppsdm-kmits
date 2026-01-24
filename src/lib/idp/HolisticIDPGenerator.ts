
import { supabase } from '../supabase/supabaseClient';
import { GlobalResourceEngine } from '../resources/GlobalResourceEngine';

// --- TYPES FOR 12-DIMENSIONAL IDP ---

export interface HolisticIDPInput {
    userId: string;
    visionStatement: string;
    coreValues: string[];
    passions: string[];
    strengths: string[];
}

export type IDPDomain =
    | 'cognitive_metacognitive'
    | 'emotional_spiritual'
    | 'physical_vital'
    | 'creative_innovative'
    | 'social_relational'
    | 'technical_professional'
    | 'leadership_influential'
    | 'financial_economic'
    | 'digital_technological'
    | 'cultural_contextual'
    | 'ethical_existential'
    | 'transformational_integrative';

export interface IDPLayerCore {
    personal_mission: string;
    core_values: string[];
    ikigai: {
        love: string[];
        good_at: string[];
        world_needs: string[];
        paid_for: string[];
        intersection: string;
    };
}

export interface IDPLayerPotential {
    innate_talents: string[];
    flow_triggers: string[];
    energy_signature: { peak_times: string[]; drain_triggers: string[] };
}

export interface DomainPlanDetail {
    current_level: string;
    target_level: string;
    subdimensions: Record<string, any>; // e.g. "Critical Thinking": { level: 5, action: "Read logic books" }
    milestones: { year: number; goal: string }[];
}

export interface IDPLayerTemporal {
    immediate: string[]; // 3-6 mo
    short_term: string[]; // 1-2 yr
    medium_term: string[]; // 3-5 yr
    long_term: string[]; // 5-10 yr
    lifespan: string[]; // 80+ yr
}

export interface HolisticIDPStructure {
    layer_1_core: IDPLayerCore;
    layer_2_potential: IDPLayerPotential;
    layer_3_development: Record<IDPDomain, DomainPlanDetail>;
    layer_4_temporal: IDPLayerTemporal;
    layer_5_resource: { learning: string[]; mentors: string[]; experiential: string[] };
    layer_6_measurement: { metrics: Record<string, any>; review_schedule: any };
}

export class HolisticIDPGenerator {

    async generateCompleteIDP(input: HolisticIDPInput): Promise<any> {
        console.log(`Generating Perfect Holistic IDP for ${input.userId}...`);

        // 1. Core Identity & Purpose Layer
        const coreLayer = this.buildCoreIdentity(input);

        // 2. Potential Mapping Layer (Mock - likely needs Assessment Data)
        const potentialLayer = this.mapPotential(input);

        // 3. Development Architecture (12 Domains)
        const developmentLayer = this.designDevelopmentArchitecture(input);

        // 4. Temporal Roadmap
        const temporalLayer = this.createTemporalRoadmap(input, developmentLayer);

        // 5. Resource Ecosystem
        const resourceLayer = await this.curateResourceEcosystem(developmentLayer);

        // 6. Measurement System
        const measurementLayer = this.designMeasurementSystem(input.visionStatement);

        // Construct Final JSON
        const fullIDP: HolisticIDPStructure = {
            layer_1_core: coreLayer,
            layer_2_potential: potentialLayer,
            layer_3_development: developmentLayer,
            layer_4_temporal: temporalLayer,
            layer_5_resource: resourceLayer,
            layer_6_measurement: measurementLayer
        };

        // Save to Database
        const { data, error } = await supabase
            .from('idps')
            .insert({
                user_id: input.userId,
                vision_statement: input.visionStatement,
                status: 'active',
                goals: fullIDP as any,
                current_participants: 12,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving Holistic IDP:', error);
            throw new Error('Database save failed');
        }

        return data;
    }

    private buildCoreIdentity(input: HolisticIDPInput): IDPLayerCore {
        return {
            personal_mission: `To actualize potential through ${input.passions.join(', ')} and contribute via ${input.strengths.join(', ')}.`,
            core_values: input.coreValues,
            ikigai: {
                love: input.passions,
                good_at: input.strengths,
                world_needs: ['Sustainable Solutions', 'Ethical Leadership'],
                paid_for: ['Professional Services', 'Innovation'],
                intersection: 'Purpose-Driven Innovator'
            }
        };
    }

    private mapPotential(input: HolisticIDPInput): IDPLayerPotential {
        return {
            innate_talents: input.strengths,
            flow_triggers: ['Complex Problem Solving', 'Creative Brainstorming'],
            energy_signature: {
                peak_times: ['Morning 09:00-11:00', 'Evening 20:00-22:00'],
                drain_triggers: ['Repetitive Admin Tasks', 'Conflict']
            }
        };
    }

    private designDevelopmentArchitecture(input: HolisticIDPInput): Record<IDPDomain, DomainPlanDetail> {
        const domains: IDPDomain[] = [
            'cognitive_metacognitive', 'emotional_spiritual', 'physical_vital',
            'creative_innovative', 'social_relational', 'technical_professional',
            'leadership_influential', 'financial_economic', 'digital_technological',
            'cultural_contextual', 'ethical_existential', 'transformational_integrative'
        ];

        const plan: any = {};

        domains.forEach(domain => {
            plan[domain] = {
                current_level: 'Developing',
                target_level: 'Mastery',
                subdimensions: {
                    focus_area: `Enhancing ${domain.replace('_', ' ')} capabilities`
                },
                milestones: [
                    { year: 2026, goal: `Foundation in ${domain}` },
                    { year: 2028, goal: `Advanced application of ${domain}` }
                ]
            };
        });

        return plan;
    }

    private createTemporalRoadmap(input: HolisticIDPInput, devLayer: any): IDPLayerTemporal {
        return {
            immediate: ['Launch core habit loop', 'Complete baseline assessment'],
            short_term: ['Achieve certification in primary skill', 'Expand network by 20%'],
            medium_term: ['Lead a significant project', 'Mentor 3 juniors'],
            long_term: ['Establish thought leadership', 'Financial independence foundation'],
            lifespan: ['Legacy of innovation', 'Spiritual self-transcendence']
        };
    }

    private async curateResourceEcosystem(devLayer: Record<IDPDomain, DomainPlanDetail>): Promise<any> {
        const resourceEngine = new GlobalResourceEngine();
        const resources: any = { learning: [], mentors: [], experiential: [] };

        // Top 3 domains focus
        const activeDomains = Object.keys(devLayer).slice(0, 3);

        for (const domain of activeDomains) {
            // Find Learning Resources
            const learningRes = await resourceEngine.findResources({
                domain: domain,
                limit: 2,
                type: 'course'
            });

            if (learningRes && learningRes.length > 0) {
                resources.learning.push(...learningRes.map((r: any) => r.title));
            } else {
                resources.learning.push(`Advanced Masterclass for ${domain.replace('_', ' ')}`);
            }
        }

        resources.mentors = ['Global Expert Network (AI Match)', 'Local Community Lead'];
        resources.experiential = ['Lead a cross-disciplinary impact project', 'Volunteer for 6 months'];

        return resources;
    }

    private designMeasurementSystem(vision: string): any {
        const isLeadershipFocused = vision.toLowerCase().includes('lead') || vision.toLowerCase().includes('manage');
        const isImpactFocused = vision.toLowerCase().includes('impact') || vision.toLowerCase().includes('social');
        const isTechFocused = vision.toLowerCase().includes('tech') || vision.toLowerCase().includes('innovat');

        const metrics: Record<string, any> = {
            fulfillment_index: { target: 9.0, freq: 'monthly', description: 'Subjective score of daily joy and purpose' },
            skill_mastery_avg: { target: 8.5, freq: 'quarterly', description: 'Average score across active domains' }
        };

        if (isLeadershipFocused) {
            metrics['influence_score'] = { target: 80, freq: 'quarterly', description: 'Measurable influence on team/community' };
        }
        if (isImpactFocused) {
            metrics['lives_touched'] = { target: 1000, freq: 'yearly', description: 'Direct positive impact on individuals' };
        }
        if (isTechFocused) {
            metrics['innovation_index'] = { target: 5, freq: 'yearly', description: 'Patents or novel solutions deployed' };
        }

        return {
            metrics: metrics,
            review_schedule: {
                daily: 'Flow State Journaling',
                weekly: 'Value Alignment Check',
                quarterly: 'Strategic Pivot Review (Quantum Adaptation)',
                yearly: 'Lifespan Vision Recalibration'
            },
            adaptation_protocol: {
                trigger: 'Sustained energy drain (>3 days)',
                action: 'Activate Resiliance Architecture'
            }
        };
    }
}
