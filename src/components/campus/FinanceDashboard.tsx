'use client';

import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

interface FinanceData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    categories: { name: string; amount: number; color: string }[];
    monthly: { month: string; income: number; expense: number }[];
    recentTransactions: { date: string; description: string; amount: number; type: string; category: string }[];
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export default function FinanceDashboard() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/campus/finances')
            .then(res => res.json())
            .then(json => {
                if (json.success) setData(json.data);
            })
            .catch(err => console.error('Finance fetch error:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                        height: 100, animation: 'pulse 1.5s infinite',
                    }} />
                ))}
            </div>
        );
    }

    if (!data) return <div style={{ color: 'rgba(255,255,255,0.5)' }}>Gagal memuat data keuangan.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <SummaryCard
                    title="Total Pemasukan"
                    value={formatRupiah(data.totalIncome)}
                    icon="💰"
                    color="#10b981"
                />
                <SummaryCard
                    title="Total Pengeluaran"
                    value={formatRupiah(data.totalExpense)}
                    icon="📊"
                    color="#f59e0b"
                />
                <SummaryCard
                    title="Saldo"
                    value={formatRupiah(data.balance)}
                    icon="🏦"
                    color={data.balance >= 0 ? '#10b981' : '#ef4444'}
                />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: 20 }}>
                {/* Pie Chart */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 20,
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h4 style={{ color: '#fff', margin: '0 0 16px', fontSize: 15 }}>Pengeluaran per Kategori</h4>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={data.categories}
                                dataKey="amount"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={40}
                                strokeWidth={2}
                                stroke="#1a1a2e"
                            >
                                {data.categories.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatRupiah(value)}
                                contentStyle={{
                                    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8, color: '#fff', fontSize: 12,
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 20,
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h4 style={{ color: '#fff', margin: '0 0 16px', fontSize: 15 }}>Pemasukan vs Pengeluaran Bulanan</h4>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={data.monthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                            <YAxis
                                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                                tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}jt`}
                            />
                            <Tooltip
                                formatter={(value: number) => formatRupiah(value)}
                                contentStyle={{
                                    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8, color: '#fff', fontSize: 12,
                                }}
                            />
                            <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Pengeluaran" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 20,
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <h4 style={{ color: '#fff', margin: '0 0 16px', fontSize: 15 }}>Transaksi Terakhir</h4>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '8px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Tanggal</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Keterangan</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Kategori</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentTransactions.map((tx, i) => (
                                <tr key={i} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'background 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)' }}>
                                        {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </td>
                                    <td style={{ padding: '10px 12px', color: '#fff' }}>{tx.description}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: 6, fontSize: 11,
                                            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                                        }}>
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td style={{
                                        padding: '10px 12px', textAlign: 'right', fontWeight: 600,
                                        color: tx.type === 'income' ? '#10b981' : '#f59e0b',
                                    }}>
                                        {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 20,
            border: '1px solid rgba(255,255,255,0.06)',
            borderTop: `3px solid ${color}`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{title}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
        </div>
    );
}
