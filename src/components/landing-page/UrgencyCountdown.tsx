'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * UrgencyCountdown - Countdown timer creating time-based urgency
 * Displays "Limited time offer" with live countdown
 */

interface UrgencyCountdownProps {
    /** Target date/time for countdown */
    targetDate?: Date;
    /** Hours from now if no targetDate */
    hoursFromNow?: number;
    /** Headline text */
    headline?: string;
    /** Whether to show the component */
    enabled?: boolean;
    /** Compact mode for inline use */
    compact?: boolean;
    /** Callback when countdown ends */
    onEnd?: () => void;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

function getDefaultTargetDate(hoursFromNow: number): Date {
    const target = new Date();
    target.setHours(target.getHours() + hoursFromNow);
    return target;
}

export function UrgencyCountdown({
    targetDate,
    hoursFromNow = 24,
    headline = 'Penawaran Spesial Berakhir Dalam',
    enabled = true,
    compact = false,
    onEnd,
}: UrgencyCountdownProps) {
    const [target] = useState<Date>(targetDate || getDefaultTargetDate(hoursFromNow));
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(target));
    const [hasEnded, setHasEnded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(target);
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 &&
                newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
                setHasEnded(true);
                onEnd?.();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [target, onEnd]);

    if (!enabled || hasEnded) return null;

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`
          ${compact ? 'w-10 h-10 text-lg' : 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl'}
          bg-gradient-to-br from-[#1A1F2E] to-[#0D1220] 
          border border-white/10 rounded-lg
          flex items-center justify-center font-bold font-mono
          text-white shadow-lg
        `}
            >
                {String(value).padStart(2, '0')}
            </motion.div>
            <span className={`${compact ? 'text-[9px]' : 'text-[10px] sm:text-xs'} text-slate-500 uppercase tracking-wider mt-1`}>
                {label}
            </span>
        </div>
    );

    const Separator = () => (
        <div className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-[#FF6B00] self-start mt-2`}>:</div>
    );

    if (compact) {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF4081]/10 border border-[#FF6B00]/30 rounded-full">
                <span className="text-xs text-[#FF6B00] font-medium">⏰</span>
                <span className="text-xs text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>
            </div>
        );
    }

    return (
        <div className="py-4 px-6 bg-gradient-to-r from-[#FF6B00]/5 via-[#FF4081]/5 to-[#7B1FA2]/5 border-y border-[#FF6B00]/20">
            <div className="max-w-3xl mx-auto text-center">
                {/* Headline */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xl">🔥</span>
                    <h3 className="text-sm sm:text-base font-semibold text-[#FF6B00]">
                        {headline}
                    </h3>
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {timeLeft.days > 0 && (
                        <>
                            <TimeBox value={timeLeft.days} label="Hari" />
                            <Separator />
                        </>
                    )}
                    <TimeBox value={timeLeft.hours} label="Jam" />
                    <Separator />
                    <TimeBox value={timeLeft.minutes} label="Menit" />
                    <Separator />
                    <TimeBox value={timeLeft.seconds} label="Detik" />
                </div>

                {/* Scarcity text */}
                <p className="mt-4 text-xs sm:text-sm text-slate-400">
                    <span className="text-[#FF6B00] font-semibold">127 mahasiswa</span> sudah mendaftar dalam 24 jam terakhir
                </p>
            </div>
        </div>
    );
}

export default UrgencyCountdown;
