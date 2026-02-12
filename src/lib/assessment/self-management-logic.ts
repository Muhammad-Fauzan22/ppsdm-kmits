import { calculateSelfManagementScore } from './selfManagementScoring';
import { selfManagementDimension } from '@/data/dimensions/self-management';
import { ScoringResult } from './scoring-engine';

export { calculateSelfManagementScore };
export type SelfManagementResult = ScoringResult;

export const SELF_MANAGEMENT_ITEMS = selfManagementDimension.items;
export const SELF_MANAGEMENT_SUBDIMENSIONS = selfManagementDimension.subdimensions;
