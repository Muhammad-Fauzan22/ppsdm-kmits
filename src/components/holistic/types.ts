/**
 * Type definitions for holistic assessment visualizations
 */

// Base dimension data
export interface DimensionData {
    dimension: string;
    score: number;
    previousScore?: number;
    facultyAverage?: number;
    target?: number;
    color: string;
}

// Radar chart specific types
export interface RadarData {
    dimension: string;
    score: number;
    previousScore?: number;
    facultyAverage?: number;
    target?: number;
    color: string;
}

// Sunburst chart specific types
export interface SunburstData {
    name: string;
    value: number;
    children?: SunburstData[];
    color?: string;
}

// Timeline chart specific types
export interface TimelineData {
    id: string;
    title: string;
    category: string;
    date: string;
    value: number;
    unit: string;
}

// Gauge chart specific types
export interface GaugeData {
    label: string;
    value: number;
    max: number;
    color: string;
}

// Network chart specific types
export interface NetworkData {
    nodes: {
        id: string;
        name: string;
        group: number;
        value: number;
    }[];
    links: {
        source: string;
        target: string;
        value: number;
    }[];
}

// Bar chart specific types
export interface BarData {
    category: string;
    value: number;
    color?: string;
}

// Flower diagram specific types
export interface FlowerData {
    petal: string;
    value: number;
    color: string;
}

// Tree diagram specific types
export interface TreeData {
    id: string;
    name: string;
    value: number;
    children?: TreeData[];
}

// Dashboard specific types
export interface DashboardData {
    metric: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    target: number;
    unit: string;
}

// Cycle diagram specific types
export interface CycleData {
    phase: string;
    value: number;
    color: string;
}
