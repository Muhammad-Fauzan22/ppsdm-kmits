import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    description: string;
}

export interface Asset {
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    averageBuyPrice: number;
    currentPrice: number; // Simulated
    type: 'stock' | 'crypto' | 'etf';
}

export interface BusinessCanvas {
    id: string;
    segment: 'partners' | 'activities' | 'resources' | 'propositions' | 'relationships' | 'channels' | 'segments' | 'cost' | 'revenue';
    content: string[];
}

export interface FinancialState {
    // Budget
    transactions: Transaction[];
    savingsGoal: number;
    totalSaved: number;

    // Portfolio
    virtualCash: number;
    portfolio: Asset[];
    tradeHistory: any[];

    // Entrepreneurship
    canvas: Record<string, string[]>;

    // Literacy
    completedModules: string[];
    quizScores: Record<string, number>;

    // Actions
    addTransaction: (tx: Omit<Transaction, 'id'>) => void;
    setSavingsGoal: (goal: number) => void;
    buyAsset: (asset: Omit<Asset, 'id' | 'averageBuyPrice'>, quantity: number, price: number) => void;
    sellAsset: (assetId: string, quantity: number, price: number) => void;
    updateCanvas: (segment: string, content: string[]) => void;
    completeModule: (moduleId: string) => void;
}

const INITIAL_CASH = 10000000; // 10 Million IDR Budget for simulation

export const useFinancialStore = create<FinancialState>()(
    persist(
        (set, get) => ({
            transactions: [],
            savingsGoal: 50000000,
            totalSaved: 0,
            virtualCash: INITIAL_CASH,
            portfolio: [],
            tradeHistory: [],
            canvas: {
                partners: [], activities: [], resources: [],
                propositions: [], relationships: [], channels: [],
                segments: [], cost: [], revenue: []
            },
            completedModules: [],
            quizScores: {},

            addTransaction: (tx) => {
                set((state) => {
                    const newTx = { ...tx, id: crypto.randomUUID() };
                    const amount = tx.type === 'income' ? tx.amount : -tx.amount;

                    // XP Trigger
                    useGamificationStore.getState().addXP(10, 'Financial Planning');

                    return {
                        transactions: [newTx, ...state.transactions],
                        totalSaved: state.totalSaved + amount
                    };
                });
            },

            setSavingsGoal: (goal) => set({ savingsGoal: goal }),

            buyAsset: (asset, quantity, price) => {
                const { virtualCash, portfolio } = get();
                const totalCost = quantity * price;

                if (totalCost > virtualCash) return; // Insufficient funds

                const existingAsset = portfolio.find(a => a.symbol === asset.symbol);
                let newPortfolio;

                if (existingAsset) {
                    const totalValue = (existingAsset.quantity * existingAsset.averageBuyPrice) + totalCost;
                    const newQuantity = existingAsset.quantity + quantity;
                    newPortfolio = portfolio.map(a => a.symbol === asset.symbol ? {
                        ...a,
                        quantity: newQuantity,
                        averageBuyPrice: totalValue / newQuantity
                    } : a);
                } else {
                    newPortfolio = [...portfolio, { ...asset, id: crypto.randomUUID(), quantity, averageBuyPrice: price }];
                }

                set({
                    virtualCash: virtualCash - totalCost,
                    portfolio: newPortfolio,
                    tradeHistory: [...get().tradeHistory, { type: 'buy', symbol: asset.symbol, quantity, price, date: new Date().toISOString() }]
                });

                useGamificationStore.getState().addXP(25, 'First Investment');
            },

            sellAsset: (assetId, quantity, price) => {
                const { portfolio, virtualCash } = get();
                const asset = portfolio.find(a => a.id === assetId);

                if (!asset || asset.quantity < quantity) return;

                const totalProceeds = quantity * price;
                const newPortfolio = portfolio.map(a => a.id === assetId ? { ...a, quantity: a.quantity - quantity } : a)
                    .filter(a => a.quantity > 0);

                set({
                    virtualCash: virtualCash + totalProceeds,
                    portfolio: newPortfolio,
                    tradeHistory: [...get().tradeHistory, { type: 'sell', symbol: asset.symbol, quantity, price, date: new Date().toISOString() }]
                });

                // Calculate profit/loss for XP?
                const profit = (price - asset.averageBuyPrice) * quantity;
                if (profit > 0) useGamificationStore.getState().addXP(50, 'Profitable Trade');
            },

            updateCanvas: (segment, content) => {
                set((state) => ({
                    canvas: { ...state.canvas, [segment]: content }
                }));
                useGamificationStore.getState().addXP(5, 'Business Planning');
            },

            completeModule: (moduleId) => {
                const { completedModules } = get();
                if (!completedModules.includes(moduleId)) {
                    set({ completedModules: [...completedModules, moduleId] });
                    useGamificationStore.getState().addXP(100, 'Financial Literacy');
                }
            },

        }),
        {
            name: 'financial-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
