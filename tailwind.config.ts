
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		// Add specific classes here if needed dynamically, avoiding regex patterns for now
		"bg-red-500", "bg-orange-500", "bg-brand-blue", "text-red-500", "text-orange-500", "text-brand-blue"
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-inter)', 'sans-serif'],
				heading: ['var(--font-space-grotesk)', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// BRANDING
				'its-blue': '#013880',   // Primary Trust
				'its-gold': '#FFD700',   // Excellence
				'its-dark': '#0A0F1A',   // Modern Background
				'brand-blue': '#135bec', // Digital
				'brand-accent': '#00d4ff', // Growth/Tech
				'success': '#10B981',
				'warning': '#F59E0B',
				'error': '#EF4444',
				// Gamification Rarity Colors (Mobile Legends inspired)
				'rarity-common': '#A0A0A0',
				'rarity-rare': '#4CAF50',
				'rarity-epic': '#9C27B0',
				'rarity-legendary': '#FF9800',
				'rarity-mythical': '#FF4081',
				// Mobile Legends Accent Colors
				'ml-orange': '#FF6B00',
				'ml-pink': '#FF4081',
				'ml-purple': '#7B1FA2',
				'ml-cyan': '#00BCD4',
				'ml-green': '#4CAF50',
				'ml-gold': '#FFD700',
				// Netflix Depth Layers
				'layer-0': '#0A0A0A',
				'layer-1': '#121212',
				'layer-2': '#1E1E1E',
				'layer-3': '#2D2D2D',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float 15s ease-in-out infinite',
				'float-delayed': 'float 18s ease-in-out infinite',
				'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				// Fusion Animations
				'shimmer': 'shimmer 1.5s infinite',
				'legendary-pulse': 'legendaryPulse 2s ease-in-out infinite',
				'mythical-glow': 'mythicalGlow 3s ease-in-out infinite',
				'hover-lift': 'hoverLift 0.25s ease-out forwards',
				'xp-fill': 'xpFill 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				// Fusion Keyframes
				shimmer: {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' },
				},
				legendaryPulse: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(255, 152, 0, 0.5)' },
					'50%': { boxShadow: '0 0 35px rgba(255, 152, 0, 0.8)' },
				},
				mythicalGlow: {
					'0%, 100%': { boxShadow: '0 0 25px rgba(255, 64, 129, 0.6)', filter: 'hue-rotate(0deg)' },
					'50%': { boxShadow: '0 0 40px rgba(123, 31, 162, 0.8)', filter: 'hue-rotate(15deg)' },
				},
				hoverLift: {
					'0%': { transform: 'translateY(0) scale(1)' },
					'100%': { transform: 'translateY(-4px) scale(1.02)' },
				},
				xpFill: {
					'0%': { width: '0%' },
					'100%': { width: 'var(--xp-width, 100%)' },
				},
			},
			zIndex: {
				'dropdown': '10',
				'sticky': '20',
				'fixed': '30',
				'modal-backdrop': '40',
				'modal': '50',
				'popover': '60',
				'tooltip': '70',
				'toast': '80',
				'max': '9999',
			}
		},
	},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("tailwindcss-animate"),
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("@tailwindcss/forms"),
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("@tailwindcss/container-queries"),
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("@tailwindcss/typography"),
	],
};
export default config;
