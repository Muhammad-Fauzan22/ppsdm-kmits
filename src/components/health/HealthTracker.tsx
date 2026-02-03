"use client";

import React, { useState } from 'react';
import { useHealthStore } from '@/lib/stores/useHealthStore';
import { Utensils, Droplets, Moon, Plus, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Simulated Indonesian Food Database
const FOOD_DB = [
    { name: 'Nasi Goreng', calories: 600, type: 'meal' },
    { name: 'Gado-gado', calories: 400, type: 'meal' },
    { name: 'Sate Ayam (5 tusuk)', calories: 350, type: 'meal' },
    { name: 'Bakso', calories: 450, type: 'meal' },
    { name: 'Tempe Goreng', calories: 150, type: 'snack' },
    { name: 'Pisang Goreng', calories: 200, type: 'snack' },
    { name: 'Apel', calories: 80, type: 'snack' },
    { name: 'Kopi Susu Gula Aren', calories: 250, type: 'snack' },
];

export default function HealthTracker() {
    const {
        dailyCalorieGoal, waterIntake, nutritionLogs, sleepHours, sleepQuality,
        logNutrition, incrementWater, setSleep
    } = useHealthStore();

    const [activeTab, setActiveTab] = useState<'nutrition' | 'sleep'>('nutrition');
    const [foodSearch, setFoodSearch] = useState('');
    const [sleepInput, setSleepInput] = useState({ hours: sleepHours, quality: sleepQuality });

    // Nutrition Calcs
    const todayCalories = nutritionLogs
        .filter(l => new Date(l.date).toDateString() === new Date().toDateString())
        .reduce((acc, curr) => acc + curr.calories, 0);

    const filteredFood = FOOD_DB.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()));

    const handleAddFood = (food: typeof FOOD_DB[0]) => {
        logNutrition({
            foodName: food.name,
            calories: food.calories,
            date: new Date().toISOString(),
            mealType: 'snack' // Default for quick add
        });
        setFoodSearch('');
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-green-500" />
                    Holistic Tracker
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('nutrition')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'nutrition' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Nutrition
                    </button>
                    <button
                        onClick={() => setActiveTab('sleep')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'sleep' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Sleep & Hydration
                    </button>
                </div>
            </div>

            {activeTab === 'nutrition' ? (
                <div className="flex flex-col h-full gap-6">
                    {/* Calorie Stats */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <div className="text-white/80 text-sm">Calories Today</div>
                                <div className="text-3xl font-bold">{todayCalories} <span className="text-base font-normal opacity-70">/ {dailyCalorieGoal} kcal</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold">{Math.round((todayCalories / dailyCalorieGoal) * 100)}%</div>
                            </div>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                            <div
                                className="bg-white rounded-full h-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (todayCalories / dailyCalorieGoal) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Food Search & Add */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            className="w-full pl-9 pr-4 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Search food (e.g. Nasi Goreng)..."
                            value={foodSearch}
                            onChange={(e) => setFoodSearch(e.target.value)}
                        />
                        {foodSearch && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-10 max-h-60 overflow-y-auto">
                                {filteredFood.map((food, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAddFood(food)}
                                        className="w-full text-left p-3 hover:bg-gray-50 flex justify-between items-center group"
                                    >
                                        <span className="font-medium text-gray-700">{food.name}</span>
                                        <span className="text-sm text-gray-500">{food.calories} kcal <Plus className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 text-green-500" /></span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Logs */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        <h3 className="font-bold text-gray-800 mb-3 text-sm">Today&apos;s Meals</h3>
                        <div className="space-y-2">
                            {nutritionLogs.slice(0, 10).map((log) => (
                                <div key={log.id} className="flex justify-between items-center p-3 bg-white border rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Utensils className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">{log.foodName}</div>
                                            <div className="text-xs text-gray-400">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-600 text-sm">
                                        {log.calories} kcal
                                    </div>
                                </div>
                            ))}
                            {nutritionLogs.length === 0 && <div className="text-center text-gray-400 py-10">No meals logged today</div>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full gap-6">
                    {/* Water Tracker */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <Droplets className="w-8 h-8 text-blue-500 mb-2" />
                        <h3 className="font-bold text-blue-900 mb-1">Hydration</h3>
                        <div className="text-4xl font-black text-blue-600 mb-4">{waterIntake} <span className="text-lg text-blue-400 font-normal">glasses</span></div>
                        <button
                            onClick={incrementWater}
                            className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Drink Water
                        </button>
                    </div>

                    {/* Sleep Monitor */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-bold text-indigo-900">Sleep Monitor</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm text-indigo-800">
                                    <span>Duration</span>
                                    <span className="font-bold">{sleepInput.hours} Hours</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="12" step="0.5"
                                    value={sleepInput.hours}
                                    onChange={(e) => setSleepInput({ ...sleepInput, hours: parseFloat(e.target.value) })}
                                    className="w-full accent-indigo-600"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm text-indigo-800">
                                    <span>Quality (1-5)</span>
                                    <span className="font-bold">{sleepInput.quality}/5</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setSleepInput({ ...sleepInput, quality: q })}
                                            className={`flex-1 py-2 rounded-lg font-bold border transition
                                                ${sleepInput.quality === q ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-300 border-indigo-200 hover:border-indigo-400'}
                                            `}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setSleep(sleepInput.hours, sleepInput.quality)}
                                className="w-full py-3 bg-indigo-900 text-white rounded-xl font-bold hover:opacity-90 transition"
                            >
                                Update Sleep Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
