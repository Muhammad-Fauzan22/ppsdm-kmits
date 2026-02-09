/**
 * Question Renderer Component
 * Renders different question types based on response scale
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QuestionConfig, ResponseScale } from '../core/types';

interface QuestionRendererProps {
  question: QuestionConfig;
  responseScale: ResponseScale;
  currentValue?: number | string | boolean;
  onResponse: (value: number | string | boolean) => void;
  error?: string | null;
  theme?: string;
  accentColor?: string;
}

export function QuestionRenderer({
  question,
  responseScale,
  currentValue,
  onResponse,
  error,
  theme = 'default',
  accentColor = '#013880'
}: QuestionRendererProps) {
  const isGamified = theme === 'gamified';

  const renderLikertScale = () => {
    const options = responseScale.options || [];
    
    return (
      <div className="space-y-4">
        <div className={`flex flex-wrap justify-center gap-2 ${isGamified ? 'gap-4' : 'gap-2'}`}>
          {options.map((option) => {
            const isSelected = currentValue === option.value;
            
            return (
              <motion.button
                key={option.value}
                onClick={() => onResponse(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-4 rounded-xl transition-all duration-200
                  ${isSelected 
                    ? 'ring-2 ring-offset-2' 
                    : 'hover:bg-gray-50'
                  }
                  ${isGamified 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-white border-2 border-gray-200'
                  }
                `}
                style={{
                  borderColor: isSelected ? accentColor : undefined
                }}

              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-current' : ''}`}>
                    {option.value}
                  </div>
                  <div className={`text-sm ${isGamified ? 'text-slate-300' : 'text-gray-600'}`}>
                    {option.label}
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      border: `2px solid ${accentColor}`,
                      backgroundColor: `${accentColor}10`
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Scale labels */}
        <div className="flex justify-between text-sm text-gray-500 px-4">
          <span>{options[0]?.label}</span>
          <span>{options[options.length - 1]?.label}</span>
        </div>
      </div>
    );
  };

  const renderYesNo = () => (
    <div className="flex justify-center gap-4">
      {[
        { value: true, label: 'Ya', icon: '✓' },
        { value: false, label: 'Tidak', icon: '✗' }
      ].map((option) => {
        const isSelected = currentValue === option.value;
        
        return (
          <motion.button
            key={option.label}
            onClick={() => onResponse(option.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex flex-col items-center p-6 rounded-xl transition-all duration-200
              ${isSelected
                ? 'ring-2 ring-offset-2 text-white'
                : isGamified
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
              }
            `}
            style={{
              backgroundColor: isSelected ? accentColor : undefined
            }}

          >
            <span className="text-3xl mb-2">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );

  const renderFrequency = () => {
    const frequencies = [
      { value: 1, label: 'Tidak Pernah', emoji: '❌' },
      { value: 2, label: 'Jarang', emoji: '😕' },
      { value: 3, label: 'Kadang-kadang', emoji: '😐' },
      { value: 4, label: 'Sering', emoji: '🙂' },
      { value: 5, label: 'Selalu', emoji: '✨' }
    ];

    return (
      <div className="space-y-3">
        {frequencies.map((freq) => {
          const isSelected = currentValue === freq.value;
          
          return (
            <motion.button
              key={freq.value}
              onClick={() => onResponse(freq.value)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                ${isSelected
                  ? 'ring-2 ring-offset-2'
                  : isGamified
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                }
              `}
              style={{
                borderColor: isSelected ? accentColor : undefined,
                backgroundColor: isSelected ? `${accentColor}10` : undefined
              }}

            >
              <span className="text-2xl">{freq.emoji}</span>
              <span className={`flex-1 text-left font-medium ${isGamified ? 'text-white' : ''}`}>
                {freq.label}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderQuestion = () => {
    switch (question.responseScale) {
      case 'likert5':
      case 'likert7':
        return renderLikertScale();
      case 'yesno':
        return renderYesNo();
      case 'frequency':
        return renderFrequency();
      default:
        return renderLikertScale();
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${isGamified ? 'text-white' : ''}`}>
      {/* Question Text */}
      <div className="mb-8">
        <h2 className={`text-xl md:text-2xl font-semibold mb-4 leading-relaxed ${isGamified ? 'text-white' : 'text-gray-900'}`}>
          {question.text}
        </h2>
        
        {question.subText && (
          <p className={`text-base ${isGamified ? 'text-slate-300' : 'text-gray-600'}`}>
            {question.subText}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Response Options */}
      <div className="mb-8">
        {renderQuestion()}
      </div>

      {/* Category Tag (if applicable) */}
      {question.category && (
        <div className="flex justify-center">
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor
            }}
          >
            {question.category}
          </span>
        </div>
      )}
    </div>
  );
}
