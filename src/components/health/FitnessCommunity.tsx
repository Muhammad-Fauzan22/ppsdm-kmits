"use client";

import React, { useState } from 'react';
import { useHealthStore } from '@/lib/stores/useHealthStore';
import { Users, MapPin, Trophy, CalendarCheck } from 'lucide-react';

const FACILITIES = [
    { id: 'fasor-badminton', name: 'Fasor Badminton Court', type: 'Court' },
    { id: 'fasor-futsal', name: 'Fasor Futsal', type: 'Field' },
    { id: 'gym-mna', name: 'MNA Gym Center', type: 'Gym' },
    { id: 'pool', name: 'ITS Swimming Pool', type: 'Pool' },
];

const CHALLENGES = [
    { id: 'walk-10k', title: '10k Steps ITS Walk', participants: 120, reward: '500 XP' },
    { id: 'run-morning', title: 'Morning Run Challenge', participants: 45, reward: '300 XP' },
    { id: 'gym-streak', title: '7-Day Gym Streak', participants: 88, reward: '1000 XP' },
];

export default function FitnessCommunity() {
    const { bookedFacilities, activeChallenges, bookFacility, joinChallenge } = useHealthStore();

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-orange-500" />
                Fitness Community
            </h2>

            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* Facility Booking */}
                <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" /> Campus Facilities
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {FACILITIES.map(fac => {
                            const isBooked = bookedFacilities.includes(fac.id);
                            return (
                                <div key={fac.id} className="p-4 border rounded-xl flex justify-between items-center hover:shadow-sm transition bg-orange-50/10">
                                    <div>
                                        <div className="font-bold text-gray-800">{fac.name}</div>
                                        <div className="text-xs text-gray-500">{fac.type}</div>
                                    </div>
                                    <button
                                        onClick={() => bookFacility(fac.id)}
                                        disabled={isBooked}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition
                                            ${isBooked ? 'bg-gray-100 text-gray-400' : 'bg-orange-500 text-white hover:bg-orange-600'}
                                        `}
                                    >
                                        {isBooked ? 'Booked' : 'Book Now'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px bg-gray-100 hidden md:block"></div>

                {/* Challenges */}
                <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" /> Active Challenges
                    </h3>
                    <div className="space-y-3">
                        {CHALLENGES.map(ch => {
                            const isJoined = activeChallenges.includes(ch.id);
                            return (
                                <div key={ch.id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-800">{ch.title}</h4>
                                        <span className="text-[10px] bg-white px-2 py-1 rounded-full border text-yellow-600 font-bold">{ch.reward}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <Users className="w-3 h-3" /> {ch.participants} participants
                                    </div>
                                    <button
                                        onClick={() => joinChallenge(ch.id)}
                                        disabled={isJoined}
                                        className={`w-full py-2 rounded-lg text-sm font-bold transition
                                            ${isJoined ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-yellow-200 text-yellow-700 hover:bg-yellow-100'}
                                        `}
                                    >
                                        {isJoined ? 'Joined ✔' : 'Join Challenge'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
