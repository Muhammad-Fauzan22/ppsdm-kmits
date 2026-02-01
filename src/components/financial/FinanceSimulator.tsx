"use client";

import React, { useState } from 'react';
import { useFinancialStore, Transaction, Asset } from '@/lib/stores/useFinancialStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock live market data
const MARKET_DATA = [
    { symbol: 'BBCA', name: 'Bank Central Asia', price: 9200, type: 'stock' },
    { symbol: 'TLKM', name: 'Telkom Indonesia', price: 3800, type: 'stock' },
    { symbol: 'ASII', name: 'Astra International', price: 5600, type: 'stock' },
    { symbol: 'BTC', name: 'Bitcoin', price: 950000000, type: 'crypto' },
    { symbol: 'ETH', name: 'Ethereum', price: 45000000, type: 'crypto' },
    { symbol: 'SBN', name: 'Surat Berharga Negara', price: 1000000, type: 'etf' },
];

export default function FinanceSimulator() {
    const {
        transactions, virtualCash, portfolio, totalSaved, savingsGoal,
        addTransaction, buyAsset, sellAsset
    } = useFinancialStore();

    const [activeTab, setActiveTab] = useState<'budget' | 'invest'>('budget');
    const [newTx, setNewTx] = useState({ description: '', amount: '', type: 'expense', category: 'Food' });
    const [tradeAction, setTradeAction] = useState({ symbol: 'BBCA', quantity: 1, action: 'buy' });

    // Budget Calculations
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = income - expense;

    const dataBudget = [
        { name: 'Income', value: income || 1 }, // Prevent 0 for chart
        { name: 'Expenses', value: expense },
    ];
    const COLORS = ['#10B981', '#EF4444'];

    const handleAddTx = () => {
        if (!newTx.description || !newTx.amount) return;
        addTransaction({
            description: newTx.description,
            amount: parseInt(newTx.amount),
            type: newTx.type as 'income' | 'expense',
            category: newTx.category,
            date: new Date().toISOString(),
        });
        setNewTx({ ...newTx, description: '', amount: '' });
    };

    const handleTrade = () => {
        const marketAsset = MARKET_DATA.find(m => m.symbol === tradeAction.symbol);
        if (!marketAsset) return;

        if (tradeAction.action === 'buy') {
            buyAsset(
                { symbol: marketAsset.symbol, name: marketAsset.name, type: marketAsset.type as any, quantity: 0, currentPrice: marketAsset.price },
                tradeAction.quantity,
                marketAsset.price
            );
        } else {
            const owned = portfolio.find(p => p.symbol === tradeAction.symbol);
            if (owned) sellAsset(owned.id, tradeAction.quantity, marketAsset.price);
        }
    };

    const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-green-600" />
                    Personal Finance Simulator
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('budget')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'budget' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Budgeting
                    </button>
                    <button
                        onClick={() => setActiveTab('invest')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'invest' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Investment
                    </button>
                </div>
            </div>

            {activeTab === 'budget' ? (
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    {/* Summary & Chart */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <div className="text-xs text-green-600 font-bold uppercase mb-1">Income</div>
                                <div className="text-lg font-bold text-green-700">{formatIDR(income)}</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <div className="text-xs text-red-600 font-bold uppercase mb-1">Expenses</div>
                                <div className="text-lg font-bold text-red-700">{formatIDR(expense)}</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="text-xs text-blue-600 font-bold uppercase mb-1">Savings Rate</div>
                                <div className="text-lg font-bold text-blue-700">
                                    {income > 0 ? Math.round(((income - expense) / income) * 100) : 0}%
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative" style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                                <PieChart>
                                    <Pie
                                        data={dataBudget}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataBudget.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: any) => formatIDR(Number(value) || 0)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <div className="text-xs text-gray-400">Net Balance</div>
                                    <div className="font-bold text-gray-700">{formatIDR(balance)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Form & List */}
                    <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-5 flex flex-col h-full">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Add Transaction
                        </h3>
                        <div className="space-y-3 mb-6">
                            <input
                                className="w-full px-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Description (e.g., Nasi Goreng)"
                                value={newTx.description}
                                onChange={e => setNewTx({ ...newTx, description: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 px-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500"
                                    type="number"
                                    placeholder="Amount"
                                    value={newTx.amount}
                                    onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
                                />
                                <select
                                    className="px-2 py-2 rounded-lg border text-sm outline-none"
                                    value={newTx.type}
                                    onChange={e => setNewTx({ ...newTx, type: e.target.value })}
                                >
                                    <option value="expense">Exp</option>
                                    <option value="income">Inc</option>
                                </select>
                            </div>

                            <button
                                onClick={handleAddTx}
                                className="w-full py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition"
                            >
                                Add Record
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[300px]">
                            {transactions.map(tx => (
                                <div key={tx.id} className="bg-white p-3 rounded-lg border flex justify-between items-center shadow-sm">
                                    <div>
                                        <div className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString()}</div>
                                        <div className="font-medium text-sm text-gray-800">{tx.description}</div>
                                    </div>
                                    <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                        {tx.type === 'income' ? '+' : '-'} {formatIDR(tx.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Portfolio Stats */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-lg">
                            <div className="text-gray-400 text-sm mb-1">Total Portfolio Value</div>
                            <div className="text-3xl font-bold mb-4">
                                {formatIDR(virtualCash + portfolio.reduce((acc, curr) => acc + (curr.quantity * curr.averageBuyPrice), 0))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">Virtual Cash</div>
                                    <div className="font-mono text-green-400">{formatIDR(virtualCash)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Total Holdings</div>
                                    <div className="font-mono text-blue-300">{portfolio.reduce((acc, c) => acc + c.quantity, 0)} Assets</div>
                                </div>
                            </div>
                        </div>

                        {/* Trade Actions */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-600" /> Market Simulation
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <select
                                    className="w-full p-2 border rounded-lg text-sm bg-gray-50"
                                    value={tradeAction.symbol}
                                    onChange={e => setTradeAction({ ...tradeAction, symbol: e.target.value })}
                                >
                                    {MARKET_DATA.map(m => (
                                        <option key={m.symbol} value={m.symbol}>
                                            {m.symbol} - {formatIDR(m.price)}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-2 border rounded-lg text-sm"
                                    value={tradeAction.quantity}
                                    onChange={e => setTradeAction({ ...tradeAction, quantity: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setTradeAction({ ...tradeAction, action: 'buy' })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${tradeAction.action === 'buy' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600'}`}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => setTradeAction({ ...tradeAction, action: 'sell' })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${tradeAction.action === 'sell' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600'}`}
                                >
                                    Sell
                                </button>
                            </div>
                            <button
                                onClick={handleTrade}
                                className={`w-full mt-3 py-2 rounded-lg text-sm font-bold text-white transition shadow-sm
                                    ${tradeAction.action === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                Execute {tradeAction.action.toUpperCase()} Order
                            </button>
                        </div>
                    </div>

                    {/* Holdings Table */}
                    <div className="flex-1 overflow-auto border rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="p-3">Asset</th>
                                    <th className="p-3">Qty</th>
                                    <th className="p-3">Avg Price</th>
                                    <th className="p-3">Current Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {portfolio.length === 0 && (
                                    <tr><td colSpan={4} className="p-6 text-center text-gray-400">No assets in portfolio. Start trading!</td></tr>
                                )}
                                {portfolio.map(asset => {
                                    const marketPrice = MARKET_DATA.find(m => m.symbol === asset.symbol)?.price || asset.averageBuyPrice;
                                    const value = asset.quantity * marketPrice;
                                    const profit = value - (asset.quantity * asset.averageBuyPrice); // Simple calc

                                    return (
                                        <tr key={asset.id} className="hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="font-bold">{asset.symbol}</div>
                                                <div className="text-xs text-gray-400">{asset.name}</div>
                                            </td>
                                            <td className="p-3">{asset.quantity}</td>
                                            <td className="p-3">{formatIDR(asset.averageBuyPrice)}</td>
                                            <td className="p-3">
                                                <div className="font-bold">{formatIDR(value)}</div>
                                                <div className={`text-xs ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {profit >= 0 ? '+' : ''}{formatIDR(profit)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
