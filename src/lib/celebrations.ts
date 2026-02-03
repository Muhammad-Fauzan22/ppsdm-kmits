// Celebration Effects & Gamification Utilities
// Uses canvas-confetti for celebration animations
// 100% FREE - no API calls

import confetti from 'canvas-confetti';

// ============================================
// CONFETTI EFFECTS
// ============================================

// Basic celebration
export function celebrate() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

// Big celebration (level up, badge earned)
export function celebrateBig() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);
}

// Stars effect (achievement unlock)
export function celebrateStars() {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'] as confetti.Shape[],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    };

    confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'] as confetti.Shape[],
    });

    confetti({
        ...defaults,
        particleCount: 20,
        scalar: 0.75,
        shapes: ['circle'] as confetti.Shape[],
    });
}

// Side cannons (course completion)
export function celebrateSideCannons() {
    const end = Date.now() + 1000;
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// Emoji rain
export function celebrateEmoji(emoji: string = '🎉') {
    const scalar = 2;
    const particle = confetti.shapeFromText({ text: emoji, scalar });

    confetti({
        shapes: [particle],
        scalar,
        particleCount: 30,
        spread: 100,
        origin: { y: 0.4 },
    });
}

// ============================================
// SOUND EFFECTS (Free URLs)
// ============================================

const SOUNDS = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/1997/1997-preview.mp3',
    badge: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    complete: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
};

export function playSound(type: keyof typeof SOUNDS) {
    try {
        const audio = new Audio(SOUNDS[type]);
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Silent fail if audio blocked
        });
    } catch {
        // Silent fail
    }
}

// ============================================
// CELEBRATION TRIGGERS
// ============================================

export function onAssessmentComplete() {
    celebrate();
    playSound('complete');
}

export function onBadgeEarned() {
    celebrateStars();
    playSound('badge');
}

export function onLevelUp() {
    celebrateBig();
    playSound('levelUp');
}

export function onCourseComplete() {
    celebrateSideCannons();
    playSound('success');
}

export function onStreakAchieved(days: number) {
    celebrateEmoji('🔥');
    if (days >= 7) celebrateBig();
}

export function onPerfectScore() {
    celebrateBig();
    celebrateEmoji('💯');
}

// ============================================
// XP ANIMATION HELPER
// ============================================

export function animateXPGain(
    element: HTMLElement | null,
    xpAmount: number
) {
    if (!element) return;

    const xpPopup = document.createElement('div');
    xpPopup.textContent = `+${xpAmount} XP`;
    xpPopup.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    font-weight: bold;
    color: #6366f1;
    animation: floatUp 1.5s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  `;

    // Add animation keyframes if not exists
    if (!document.getElementById('xp-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'xp-animation-styles';
        style.textContent = `
      @keyframes floatUp {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
      }
    `;
        document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.appendChild(xpPopup);

    setTimeout(() => xpPopup.remove(), 1500);
}

const celebrations = {
    celebrate,
    celebrateBig,
    celebrateStars,
    celebrateSideCannons,
    celebrateEmoji,
    playSound,
    onAssessmentComplete,
    onBadgeEarned,
    onLevelUp,
    onCourseComplete,
    onStreakAchieved,
    onPerfectScore,
    animateXPGain,
};

export default celebrations;
