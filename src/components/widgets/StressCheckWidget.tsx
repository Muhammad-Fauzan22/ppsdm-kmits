'use client';

import { useState } from 'react';
import { STRESS_QUESTIONS, EMERGENCY_CONTACTS, calculateStressResult } from '@/lib/campus/stress-quiz';
import type { StressResult } from '@/lib/campus/types';

export default function StressCheckWidget() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = result
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<StressResult | null>(null);

    const reset = () => { setStep(0); setAnswers([]); setResult(null); };

    const handleAnswer = (value: number) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);
        if (newAnswers.length >= STRESS_QUESTIONS.length) {
            setResult(calculateStressResult(newAnswers));
            setStep(STRESS_QUESTIONS.length + 1);
        } else {
            setStep(step + 1);
        }
    };

    if (!open) {
        return (
            <button
                onClick={() => { setOpen(true); reset(); }}
                style={{
                    position: 'fixed', bottom: 90, right: 20, zIndex: 900,
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    border: 'none', cursor: 'pointer', fontSize: 22,
                    boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                title="Cek Tingkat Stres"
            >
                🧠
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 20,
        }} onClick={() => setOpen(false)}>
            <div onClick={e => e.stopPropagation()} style={{
                background: '#1a1a2e', borderRadius: 16, padding: 28,
                maxWidth: 480, width: '100%', maxHeight: '85vh', overflow: 'auto',
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: 18 }}>🧠 Quick Stress Check</h3>
                    <button onClick={() => setOpen(false)} style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', fontSize: 18,
                    }}>✕</button>
                </div>

                {/* Intro */}
                {step === 0 && (
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: 14 }}>
                            Kuis singkat ini membantu kamu mengenali tingkat stresmu saat ini.
                            5 pertanyaan, kurang dari 1 menit.
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                            ⚠️ Ini bukan diagnosis klinis, hanya alat bantu refleksi diri.
                        </p>
                        <button onClick={() => setStep(1)} style={{
                            width: '100%', padding: '12px 20px', borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none', color: '#fff', fontSize: 15, fontWeight: 600,
                            cursor: 'pointer', marginTop: 16,
                        }}>
                            Mulai Cek Stres →
                        </button>
                    </div>
                )}

                {/* Questions */}
                {step >= 1 && step <= STRESS_QUESTIONS.length && (
                    <div>
                        <div style={{
                            display: 'flex', gap: 4, marginBottom: 16,
                        }}>
                            {STRESS_QUESTIONS.map((_, i) => (
                                <div key={i} style={{
                                    flex: 1, height: 4, borderRadius: 2,
                                    background: i < step ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                    transition: 'background 0.3s',
                                }} />
                            ))}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>
                            Pertanyaan {step} dari {STRESS_QUESTIONS.length}
                        </p>
                        <p style={{ color: '#fff', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                            {STRESS_QUESTIONS[step - 1].text}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {STRESS_QUESTIONS[step - 1].options.map((opt, i) => (
                                <button key={i} onClick={() => handleAnswer(opt.value)} style={{
                                    padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)',
                                    fontSize: 14, cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && step > STRESS_QUESTIONS.length && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: `${result.color}20`, border: `3px solid ${result.color}`,
                                fontSize: 32,
                            }}>
                                {result.level === 'rendah' ? '😊' : result.level === 'sedang' ? '😐' : result.level === 'tinggi' ? '😰' : '😟'}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: result.color }}>
                                Stres Level: {result.label}
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                Skor: {result.score}/{result.maxScore}
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>
                            {result.description}
                        </p>
                        <div style={{ marginTop: 16 }}>
                            <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>💡 Saran:</h4>
                            <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                                {result.suggestions.map((s, i) => (
                                    <li key={i} style={{ marginBottom: 6, lineHeight: 1.5 }}>{s}</li>
                                ))}
                            </ul>
                        </div>

                        {(result.level === 'tinggi' || result.level === 'sangat_tinggi') && (
                            <div style={{
                                marginTop: 16, padding: 14, borderRadius: 10,
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                            }}>
                                <h4 style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>📞 Kontak Bantuan:</h4>
                                {EMERGENCY_CONTACTS.map((c, i) => (
                                    <div key={i} style={{ marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                                        <strong style={{ color: '#fff' }}>{c.name}</strong>: {c.phone}
                                        <br /><span style={{ fontSize: 11 }}>{c.description}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                            <button onClick={() => { reset(); setStep(1); }} style={{
                                flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                                background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 13,
                            }}>
                                Ulangi
                            </button>
                            <button onClick={() => setOpen(false)} style={{
                                flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                                background: '#6366f1', color: '#fff', cursor: 'pointer', fontSize: 13,
                            }}>
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
