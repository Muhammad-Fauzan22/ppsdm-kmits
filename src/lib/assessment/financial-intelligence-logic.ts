import { calculateFinancialScores, FinancialResult, FinancialResponse } from './financialScoring';
import { financialDimension } from '@/data/dimensions/financial';

export { calculateFinancialScores };
export type { FinancialResult, FinancialResponse };

export const FINANCIAL_ITEMS = financialDimension.items;
