/**
 * Assessment Dimensions Data Export
 * 
 * This file exports all 9 dimensions of the holistic assessment system.
 * Each dimension includes:
 * - Research methodology and psychometric properties
 * - Assessment items with validated parameters
 * - Subdimensions and scoring algorithms
 * - Interpretation levels and recommendations
 */

import { DimensionData } from './types';
import cognitiveDimension from './cognitive';
import selfManagementDimension from './self-management';
import financialDimension from './financial';
import physicalDimension from './physical';
import emotionalSocialDimension from './emotional-social';
import mentalHealthDimension from './mental-health';
import characterDimension from './character';
import spiritualDimension from './spiritual';
import environmentalDimension from './environmental';

export const DIMENSIONS: Record<number, DimensionData> = {
    1: cognitiveDimension,
    2: selfManagementDimension,
    3: financialDimension,
    4: physicalDimension,
    5: emotionalSocialDimension,
    6: mentalHealthDimension,
    7: characterDimension,
    8: spiritualDimension,
    9: environmentalDimension,
};

export const DIMENSION_SLUGS: Record<string, number> = {
    'cognitive': 1,
    'self-management': 2,
    'financial': 3,
    'physical': 4,
    'emotional-social': 5,
    'mental-health': 6,
    'character': 7,
    'spiritual': 8,
    'environmental': 9,
};

export const getDimensionById = (id: number): DimensionData | undefined => {
    return DIMENSIONS[id];
};

export const getDimensionBySlug = (slug: string): DimensionData | undefined => {
    const id = DIMENSION_SLUGS[slug];
    return id ? DIMENSIONS[id] : undefined;
};

export const getAllDimensions = (): DimensionData[] => {
    return Object.values(DIMENSIONS);
};

export const getHardSkillsDimensions = (): DimensionData[] => {
    return Object.values(DIMENSIONS).filter(d => d.type === 'hard');
};

export const getSoftSkillsDimensions = (): DimensionData[] => {
    return Object.values(DIMENSIONS).filter(d => d.type === 'soft');
};

export default DIMENSIONS;
