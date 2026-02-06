/**
 * Assessment Components Index
 * Export all assessment-related components
 */

export { DimensionInfoPage } from './DimensionInfoPage';
export { AssessmentQuestion } from './AssessmentQuestion';
export { IncompleteAssessmentModal, useIncompleteModalStore, useIncompleteAssessmentReminder } from './IncompleteAssessmentModal';
export { SelfManagementDashboard } from './SelfManagementDashboard';

// Re-export from existing visualizations
export { HolisticRadarChart } from '../visualizations/HolisticRadarChart';
export { CognitiveSunburst } from './CognitiveSunburst';
export { PhysicalHealthDashboard } from './PhysicalHealthDashboard';
export { MentalHealthGauge } from './MentalHealthGauge';
export { CharacterTree } from './CharacterTree';
export { SpiritualSpiral } from './SpiritualSpiral';
export { EnvironmentalEco } from './EnvironmentalEco';

// Export types
export type { AssessmentState, Answer, DimensionProgress } from '@/lib/assessment/store';
