/**
 * A/B Testing Framework untuk PPSDM KMITS
 * Mendukung eksperimen A/B testing tanpa biaya
 */

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  startDate: Date;
  endDate?: Date;
  targetAudience?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  metrics: Metric[];
  trafficAllocation: number; // 0-1, percentage of traffic to include
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, relative weight compared to other variants
  config: Record<string, any>;
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  type: 'conversion' | 'engagement' | 'revenue' | 'custom';
  goal?: number;
}

export interface ExperimentResult {
  experimentId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  metrics: Record<string, number>;
  customData?: Record<string, any>;
}

export interface VariantStats {
  variantId: string;
  variantName: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  metrics: Record<string, {
    value: number;
    change: number;
    changePercentage: number;
    significance: number;
    isSignificant: boolean;
  }>;
}

export interface ExperimentStats {
  experimentId: string;
  experimentName: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  totalParticipants: number;
  totalConversions: number;
  overallConversionRate: number;
  variants: VariantStats[];
  winner?: {
    variantId: string;
    variantName: string;
    confidence: number;
  };
}

/**
 * A/B Testing Manager
 */
export class ABTestingManager {
  private experiments: Map<string, Experiment> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> experimentId -> variantId
  private results: ExperimentResult[] = [];
  private storageKey = 'ab_testing_data';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.experiments = new Map(parsed.experiments || []);
        this.userAssignments = new Map(
          Object.entries(parsed.userAssignments || {}).map(([userId, assignments]) => [
            userId,
            new Map(assignments as Record<string, string>),
          ])
        );
        this.results = parsed.results || [];
      }
    } catch (error) {
      console.error('[ABTesting] Failed to load from storage:', error);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        experiments: Array.from(this.experiments.entries()),
        userAssignments: Object.fromEntries(
          Array.from(this.userAssignments.entries()).map(([userId, assignments]) => [
            userId,
            Object.fromEntries(assignments.entries()),
          ])
        ),
        results: this.results,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[ABTesting] Failed to save to storage:', error);
    }
  }

  /**
   * Create a new experiment
   */
  createExperiment(experiment: Omit<Experiment, 'status'>): Experiment {
    const newExperiment: Experiment = {
      ...experiment,
      status: 'draft',
    };

    // Validate variants
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.001) {
      throw new Error('Variant weights must sum to 1');
    }

    this.experiments.set(experiment.id, newExperiment);
    this.saveToStorage();

    return newExperiment;
  }

  /**
   * Get experiment by ID
   */
  getExperiment(experimentId: string): Experiment | undefined {
    return this.experiments.get(experimentId);
  }

  /**
   * Get all experiments
   */
  getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  /**
   * Get active experiments
   */
  getActiveExperiments(): Experiment[] {
    const now = new Date();
    return Array.from(this.experiments.values()).filter(
      (exp) =>
        exp.status === 'active' &&
        exp.startDate <= now &&
        (!exp.endDate || exp.endDate >= now)
    );
  }

  /**
   * Update experiment
   */
  updateExperiment(
    experimentId: string,
    updates: Partial<Experiment>
  ): Experiment | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    const updatedExperiment = { ...experiment, ...updates };
    this.experiments.set(experimentId, updatedExperiment);
    this.saveToStorage();

    return updatedExperiment;
  }

  /**
   * Delete experiment
   */
  deleteExperiment(experimentId: string): boolean {
    const result = this.experiments.delete(experimentId);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  /**
   * Start experiment
   */
  startExperiment(experimentId: string): Experiment | null {
    return this.updateExperiment(experimentId, { status: 'active' });
  }

  /**
   * Pause experiment
   */
  pauseExperiment(experimentId: string): Experiment | null {
    return this.updateExperiment(experimentId, { status: 'paused' });
  }

  /**
   * Complete experiment
   */
  completeExperiment(experimentId: string): Experiment | null {
    return this.updateExperiment(experimentId, { status: 'completed' });
  }

  /**
   * Assign user to variant
   */
  assignVariant(
    experimentId: string,
    userId: string,
    sessionId: string
  ): Variant | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'active') {
      return null;
    }

    // Check if user is already assigned
    const userAssignments = this.userAssignments.get(userId) || new Map();
    const existingVariantId = userAssignments.get(experimentId);
    if (existingVariantId) {
      return experiment.variants.find((v) => v.id === existingVariantId) || null;
    }

    // Check traffic allocation
    const random = Math.random();
    if (random > experiment.trafficAllocation) {
      return null; // User not included in experiment
    }

    // Assign variant based on weights
    let cumulativeWeight = 0;
    const variantRandom = Math.random();
    let selectedVariant: Variant | null = null;

    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (variantRandom <= cumulativeWeight) {
        selectedVariant = variant;
        break;
      }
    }

    if (selectedVariant) {
      userAssignments.set(experimentId, selectedVariant.id);
      this.userAssignments.set(userId, userAssignments);
      this.saveToStorage();
    }

    return selectedVariant;
  }

  /**
   * Get user's variant for experiment
   */
  getUserVariant(experimentId: string, userId: string): Variant | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    const userAssignments = this.userAssignments.get(userId);
    const variantId = userAssignments?.get(experimentId);

    if (!variantId) {
      return null;
    }

    return experiment.variants.find((v) => v.id === variantId) || null;
  }

  /**
   * Track metric
   */
  trackMetric(
    experimentId: string,
    userId: string,
    sessionId: string,
    metricId: string,
    value: number = 1,
    customData?: Record<string, any>
  ): void {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return;
    }

    const variant = this.getUserVariant(experimentId, userId);
    if (!variant) {
      return;
    }

    const result: ExperimentResult = {
      experimentId,
      variantId: variant.id,
      userId,
      sessionId,
      timestamp: new Date(),
      metrics: { [metricId]: value },
      customData,
    };

    this.results.push(result);
    this.saveToStorage();
  }

  /**
   * Track conversion
   */
  trackConversion(
    experimentId: string,
    userId: string,
    sessionId: string,
    customData?: Record<string, any>
  ): void {
    this.trackMetric(experimentId, userId, sessionId, 'conversion', 1, customData);
  }

  /**
   * Track custom event
   */
  trackEvent(
    experimentId: string,
    userId: string,
    sessionId: string,
    eventName: string,
    value: number = 1,
    customData?: Record<string, any>
  ): void {
    this.trackMetric(experimentId, userId, sessionId, eventName, value, customData);
  }

  /**
   * Calculate experiment statistics
   */
  calculateExperimentStats(experimentId: string): ExperimentStats | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    // Filter results for this experiment
    const experimentResults = this.results.filter(
      (r) => r.experimentId === experimentId
    );

    // Calculate stats for each variant
    const variantStats: VariantStats[] = experiment.variants.map((variant) => {
      const variantResults = experimentResults.filter(
        (r) => r.variantId === variant.id
      );
      const participants = new Set(variantResults.map((r) => r.userId)).size;
      const conversions = variantResults.filter(
        (r) => r.metrics.conversion === 1
      ).length;
      const conversionRate = participants > 0 ? conversions / participants : 0;

      // Calculate metrics
      const metrics: Record<string, any> = {};
      for (const metric of experiment.metrics) {
        const metricResults = variantResults
          .map((r) => r.metrics[metric.id] || 0)
          .filter((v) => v > 0);
        const metricValue =
          metricResults.length > 0
            ? metricResults.reduce((sum, v) => sum + v, 0) / metricResults.length
            : 0;

        // Calculate significance (simplified)
        const significance = this.calculateSignificance(
          variantResults,
          metric.id
        );

        metrics[metric.id] = {
          value: metricValue,
          change: 0, // Will be calculated relative to control
          changePercentage: 0,
          significance,
          isSignificant: significance < 0.05,
        };
      }

      return {
        variantId: variant.id,
        variantName: variant.name,
        participants,
        conversions,
        conversionRate,
        metrics,
      };
    });

    // Calculate relative changes (first variant is control)
    if (variantStats.length > 1) {
      const controlStats = variantStats[0];
      for (let i = 1; i < variantStats.length; i++) {
        const treatmentStats = variantStats[i];
        for (const metricId in treatmentStats.metrics) {
          const controlValue = controlStats.metrics[metricId]?.value || 0;
          const treatmentValue = treatmentStats.metrics[metricId]?.value || 0;
          const change = treatmentValue - controlValue;
          const changePercentage =
            controlValue > 0 ? (change / controlValue) * 100 : 0;

          treatmentStats.metrics[metricId].change = change;
          treatmentStats.metrics[metricId].changePercentage = changePercentage;
        }
      }
    }

    // Calculate overall stats
    const totalParticipants = variantStats.reduce(
      (sum, v) => sum + v.participants,
      0
    );
    const totalConversions = variantStats.reduce(
      (sum, v) => sum + v.conversions,
      0
    );
    const overallConversionRate =
      totalParticipants > 0 ? totalConversions / totalParticipants : 0;

    // Determine winner
    let winner: ExperimentStats['winner'] | undefined;
    if (variantStats.length > 1) {
      const bestVariant = variantStats.reduce((best, current) =>
        current.conversionRate > best.conversionRate ? current : best
      );
      const confidence = this.calculateConfidence(variantStats);
      winner = {
        variantId: bestVariant.variantId,
        variantName: bestVariant.variantName,
        confidence,
      };
    }

    return {
      experimentId,
      experimentName: experiment.name,
      status: experiment.status,
      startDate: experiment.startDate,
      endDate: experiment.endDate,
      totalParticipants,
      totalConversions,
      overallConversionRate,
      variants: variantStats,
      winner,
    };
  }

  /**
   * Calculate statistical significance (simplified)
   */
  private calculateSignificance(
    results: ExperimentResult[],
    metricId: string
  ): number {
    // Simplified calculation - in production, use proper statistical tests
    const values = results.map((r) => r.metrics[metricId] || 0);
    if (values.length < 2) {
      return 1; // Not significant
    }

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const standardError = stdDev / Math.sqrt(values.length);

    // Z-score for 95% confidence
    const zScore = 1.96;
    const marginOfError = zScore * standardError;

    // Return p-value (simplified)
    return marginOfError > 0 ? 0.05 : 0.1;
  }

  /**
   * Calculate confidence for winner
   */
  private calculateConfidence(variantStats: VariantStats[]): number {
    if (variantStats.length < 2) {
      return 0;
    }

    // Simplified confidence calculation
    const bestVariant = variantStats.reduce((best, current) =>
      current.conversionRate > best.conversionRate ? current : best
    );
    const secondBest = variantStats
      .filter((v) => v.variantId !== bestVariant.variantId)
      .reduce((best, current) =>
        current.conversionRate > best.conversionRate ? current : best
      );

    const difference = bestVariant.conversionRate - secondBest.conversionRate;
    const pooledRate =
      (bestVariant.conversions + secondBest.conversions) /
      (bestVariant.participants + secondBest.participants);
    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) *
        (1 / bestVariant.participants + 1 / secondBest.participants)
    );

    if (standardError === 0) {
      return 0;
    }

    const zScore = difference / standardError;
    const confidence = Math.min(1, Math.max(0, zScore / 2));

    return confidence;
  }

  /**
   * Get all results
   */
  getAllResults(): ExperimentResult[] {
    return [...this.results];
  }

  /**
   * Get results for experiment
   */
  getExperimentResults(experimentId: string): ExperimentResult[] {
    return this.results.filter((r) => r.experimentId === experimentId);
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.experiments.clear();
    this.userAssignments.clear();
    this.results = [];
    this.saveToStorage();
  }

  /**
   * Export data
   */
  exportData(): string {
    const data = {
      experiments: Array.from(this.experiments.entries()),
      userAssignments: Object.fromEntries(
        Array.from(this.userAssignments.entries()).map(([userId, assignments]) => [
          userId,
          Object.fromEntries(assignments.entries()),
        ])
      ),
      results: this.results,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data
   */
  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      this.experiments = new Map(parsed.experiments || []);
      this.userAssignments = new Map(
        Object.entries(parsed.userAssignments || {}).map(([userId, assignments]) => [
          userId,
          new Map(assignments as Record<string, string>),
        ])
      );
      this.results = parsed.results || [];
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('[ABTesting] Failed to import data:', error);
      return false;
    }
  }
}

// Global instance
let abTestingManager: ABTestingManager | null = null;

/**
 * Get A/B testing manager instance
 */
export function getABTestingManager(): ABTestingManager {
  if (!abTestingManager) {
    abTestingManager = new ABTestingManager();
  }
  return abTestingManager;
}

/**
 * Initialize A/B testing
 */
export function initializeABTesting(): ABTestingManager {
  return getABTestingManager();
}

/**
 * Get variant for user
 */
export function getVariant(
  experimentId: string,
  userId: string,
  sessionId: string
): Variant | null {
  const manager = getABTestingManager();
  return manager.assignVariant(experimentId, userId, sessionId);
}

/**
 * Track conversion
 */
export function trackConversion(
  experimentId: string,
  userId: string,
  sessionId: string,
  customData?: Record<string, any>
): void {
  const manager = getABTestingManager();
  manager.trackConversion(experimentId, userId, sessionId, customData);
}

/**
 * Track event
 */
export function trackEvent(
  experimentId: string,
  userId: string,
  sessionId: string,
  eventName: string,
  value: number = 1,
  customData?: Record<string, any>
): void {
  const manager = getABTestingManager();
  manager.trackEvent(experimentId, userId, sessionId, eventName, value, customData);
}

/**
 * Get experiment stats
 */
export function getExperimentStats(experimentId: string): ExperimentStats | null {
  const manager = getABTestingManager();
  return manager.calculateExperimentStats(experimentId);
}
