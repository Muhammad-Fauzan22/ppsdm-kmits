"use client";

import React from 'react';
import { Info } from 'lucide-react';

interface ExampleBadgeProps {
  text?: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * ExampleBadge Component
 * 
 * Menandai data contoh/preview agar pengguna tidak bingung
 * dengan data pribadi mereka. Menggunakan warna kuning/oranye
 * yang mencolok untuk perhatian.
 */
export function ExampleBadge({ 
  text = "Contoh", 
  className = "",
  showIcon = true 
}: ExampleBadgeProps) {
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 
        px-2.5 py-1 
        bg-amber-100 text-amber-800 
        border border-amber-200
        rounded-full 
        text-xs font-semibold 
        ${className}
      `}
      role="note"
      aria-label={`Ini adalah data ${text}`}
    >
      {showIcon && <Info className="w-3.5 h-3.5" aria-hidden="true" />}
      {text}
    </span>
  );
}

/**
 * ExampleBanner - Versi banner yang lebih besar untuk section
 */
export function ExampleBanner({ 
  text = "Ini adalah contoh tampilan. Data pribadi Anda akan muncul setelah login.",
  className = "" 
}: { 
  text?: string; 
  className?: string;
}) {
  return (
    <div 
      className={`
        bg-gradient-to-r from-amber-50 to-orange-50 
        border-l-4 border-amber-400 
        p-4 rounded-r-lg
        ${className}
      `}
      role="note"
      aria-label="Pemberitahuan data contoh"
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-amber-800 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/**
 * DemoLabel - Label kecil untuk item demo
 */
export function DemoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
      Demo
    </span>
  );
}

export default ExampleBadge;
