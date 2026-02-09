/**
 * useValidation Hook
 * Hook for validating assessment responses
 */

'use client';

import { useCallback, useState } from 'react';
import { 
  QuestionConfig, 
  ValidationResult, 
  ValidationError,
  ValidationWarning,
  ResponseScaleType 
} from '../core/types';

interface UseValidationProps {
  strictMode?: boolean;
  customRules?: Record<string, (value: any) => boolean>;
}

interface UseValidationReturn {
  validateResponse: (
    question: QuestionConfig, 
    value: number | string | boolean
  ) => ValidationResult;
  validateAll: (
    questions: QuestionConfig[], 
    responses: Map<string, any> | Record<string, any>
  ) => ValidationResult;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  clearErrors: () => void;
}


export function useValidation({
  strictMode = false,
  customRules = {}
}: UseValidationProps = {}): UseValidationReturn {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setWarnings([]);
  }, []);

  /**
   * Validate a single response based on question configuration
   */
  const validateResponse = useCallback((
    question: QuestionConfig,
    value: number | string | boolean
  ): ValidationResult => {
    const resultErrors: ValidationError[] = [];
    const resultWarnings: ValidationWarning[] = [];

    // Required check
    if (value === undefined || value === null || value === '') {
      resultErrors.push({
        field: question.id,
        message: 'Response is required',
        code: 'REQUIRED'
      });
      return { valid: false, errors: resultErrors, warnings: resultWarnings };
    }

    // Type-specific validation
    switch (question.responseScale) {
      case 'likert5':
        validateLikert(value, 1, 5, question.id, resultErrors, resultWarnings);
        break;
      case 'likert7':
        validateLikert(value, 1, 7, question.id, resultErrors, resultWarnings);
        break;
      case 'yesno':
        validateYesNo(value, question.id, resultErrors);
        break;
      case 'frequency':
        validateFrequency(value, question.id, resultErrors);
        break;
      default:
        // Custom scale - basic type check
        if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'boolean') {
          resultErrors.push({
            field: question.id,
            message: 'Invalid response type',
            code: 'INVALID_TYPE'
          });
        }
    }

    // Custom rule validation
    if (customRules[question.id]) {
      if (!customRules[question.id](value)) {
        resultErrors.push({
          field: question.id,
          message: 'Custom validation failed',
          code: 'CUSTOM_VALIDATION'
        });
      }
    }

    // Reverse scoring warning (if applicable)
    if (question.reverseScored && strictMode) {
      resultWarnings.push({
        field: question.id,
        message: 'This question is reverse-scored',
        suggestion: 'Your response will be inverted during scoring'
      });
    }

    const result: ValidationResult = {
      valid: resultErrors.length === 0,
      errors: resultErrors,
      warnings: resultWarnings
    };

    // Update state
    setErrors(prev => [...prev.filter(e => e.field !== question.id), ...resultErrors]);
    setWarnings(prev => [...prev.filter(w => w.field !== question.id), ...resultWarnings]);

    return result;
  }, [strictMode, customRules]);

  /**
   * Validate all responses for completeness
   */
  const validateAll = useCallback((
    questions: QuestionConfig[],
    responses: Map<string, any> | Record<string, any>
  ): ValidationResult => {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    // Helper to get value from either Map or Record
    const getValue = (key: string): any => {
      if (responses instanceof Map) {
        return responses.get(key);
      }
      return (responses as Record<string, any>)[key];
    };

    // Helper to iterate over responses
    const getResponseEntries = (): [string, any][] => {
      if (responses instanceof Map) {
        return Array.from(responses.entries());
      }
      return Object.entries(responses);
    };

    questions.forEach(question => {
      const value = getValue(question.id);

      
      if (value === undefined || value === null) {
        allErrors.push({
          field: question.id,
          message: `Question "${question.text}" is unanswered`,
          code: 'INCOMPLETE'
        });
      } else {
        const result = validateResponse(question, value);
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
      }
    });

    // Check for extra responses (responses to questions not in the list)
    getResponseEntries().forEach(([key, value]) => {
      if (!questions.find(q => q.id === key)) {
        allWarnings.push({
          field: key,
          message: 'Response found for unknown question',
          suggestion: 'This response may be from a previous session'
        });
      }
    });


    const result: ValidationResult = {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };

    setErrors(allErrors);
    setWarnings(allWarnings);

    return result;
  }, [validateResponse]);

  return {
    validateResponse,
    validateAll,
    errors,
    warnings,
    clearErrors
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

function validateLikert(
  value: any,
  min: number,
  max: number,
  field: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (typeof value !== 'number') {
    errors.push({
      field,
      message: 'Response must be a number',
      code: 'TYPE_ERROR'
    });
    return;
  }

  if (value < min || value > max) {
    errors.push({
      field,
      message: `Response must be between ${min} and ${max}`,
      code: 'OUT_OF_RANGE'
    });
    return;
  }

  // Warning for extreme values (possible straight-lining)
  if (value === min || value === max) {
    warnings.push({
      field,
      message: 'Extreme value selected',
      suggestion: 'Consider if this truly reflects your position'
    });
  }
}

function validateYesNo(
  value: any,
  field: string,
  errors: ValidationError[]
): void {
  if (typeof value !== 'boolean' && value !== 'yes' && value !== 'no') {
    errors.push({
      field,
      message: 'Response must be yes or no',
      code: 'INVALID_VALUE'
    });
  }
}

function validateFrequency(
  value: any,
  field: string,
  errors: ValidationError[]
): void {
  const validFrequencies = ['never', 'rarely', 'sometimes', 'often', 'always'];
  
  if (typeof value === 'string' && !validFrequencies.includes(value.toLowerCase())) {
    errors.push({
      field,
      message: `Response must be one of: ${validFrequencies.join(', ')}`,
      code: 'INVALID_FREQUENCY'
    });
  } else if (typeof value === 'number' && (value < 1 || value > 5)) {
    errors.push({
      field,
      message: 'Frequency rating must be between 1 and 5',
      code: 'OUT_OF_RANGE'
    });
  }
}

/**
 * Validate response consistency across related questions
 */
export function validateConsistency(
  responses: Map<string, number>,
  questionPairs: Array<[string, string]>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  questionPairs.forEach(([q1, q2]) => {
    const r1 = responses.get(q1);
    const r2 = responses.get(q2);

    if (r1 !== undefined && r2 !== undefined) {
      // Check for contradictory responses (e.g., strongly agree to both positive and negative statements)
      const diff = Math.abs(r1 - r2);
      if (diff > 3) {
        warnings.push({
          field: `${q1},${q2}`,
          message: 'Potentially inconsistent responses detected',
          suggestion: 'Please review your answers for these related questions'
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Check for response patterns that may indicate careless responding
 */
export function detectCarelessResponding(
  responses: Map<string, number>,
  threshold: number = 0.8
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const values = Array.from(responses.values());

  if (values.length < 3) {
    return { valid: true, errors, warnings };
  }

  // Check for straight-lining (same response to all questions)
  const uniqueValues = new Set(values);
  if (uniqueValues.size === 1) {
    warnings.push({
      field: 'all',
      message: 'All responses are identical',
      suggestion: 'Please ensure you are answering thoughtfully and not selecting the same option for every question'
    });
  }

  // Check for alternating pattern
  let alternations = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1]) {
      alternations++;
    }
  }
  
  const alternationRate = alternations / (values.length - 1);
  if (alternationRate > threshold) {
    warnings.push({
      field: 'all',
      message: 'Unusual response pattern detected',
      suggestion: 'Your responses show a high degree of alternation. Please review your answers.'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
