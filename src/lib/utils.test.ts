import { describe, it, expect, test } from 'vitest'
import { cn, convertDriveToDirectLink } from './utils'

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('w-4', 'p-2')).toBe('w-4 p-2')
        })

        it('should handle conditional classes', () => {
            expect(cn('w-4', true && 'p-2', false && 'm-2')).toBe('w-4 p-2')
        })

        it('should resolve tailwind conflicts', () => {
            expect(cn('p-2', 'p-4')).toBe('p-4')
        })

        it('should handle empty inputs', () => {
            expect(cn()).toBe('')
        })

        it('should handle mixed class value types', () => {
            expect(cn('w-4', ['p-2', 'm-2'])).toBe('w-4 p-2 m-2')
        })

        it('should handle nested arrays', () => {
            expect(cn('w-4', ['p-2', ['m-2']])).toBe('w-4 p-2 m-2')
        })
    })

    describe('convertDriveToDirectLink', () => {
        it('should convert standard view link', () => {
            const input = 'https://drive.google.com/file/d/1abcde12345/view?usp=sharing'
            const expected = 'https://drive.google.com/uc?export=download&id=1abcde12345'
            expect(convertDriveToDirectLink(input)).toBe(expected)
        })

        it('should convert id-based link', () => {
            const input = 'https://drive.google.com/open?id=1abcde12345'
            const expected = 'https://drive.google.com/uc?export=download&id=1abcde12345'
            expect(convertDriveToDirectLink(input)).toBe(expected)
        })

        it('should return empty string for null', () => {
            expect(convertDriveToDirectLink(null)).toBe('')
        })

        it('should return empty string for undefined', () => {
            expect(convertDriveToDirectLink(undefined)).toBe('')
        })

        it('should return original string if invalid drive link', () => {
            const input = 'https://example.com/file.pdf'
            expect(convertDriveToDirectLink(input)).toBe(input)
        })

        it('should return original link if already direct link', () => {
            const input = 'https://drive.google.com/uc?export=download&id=1abcde12345'
            expect(convertDriveToDirectLink(input)).toBe(input)
        })

        it('should handle links with special characters in ID', () => {
            const input = 'https://drive.google.com/file/d/abc-123_456/view'
            const expected = 'https://drive.google.com/uc?export=download&id=abc-123_456'
            expect(convertDriveToDirectLink(input)).toBe(expected)
        })
    })
})

// ============================================
// TESTING PATTERNS DOCUMENTATION
// ============================================
/**
 * Testing Best Practices for PPSDM KMITS:
 *
 * 1. Use descriptive test names
 * 2. Follow AAA pattern: Arrange, Act, Assert
 * 3. Test edge cases and error conditions
 * 4. Keep tests isolated and independent
 * 5. Use meaningful assertions
 *
 * Example structure:
 *
 * describe('FeatureName', () => {
 *     describe('normal behavior', () => {
 *         it('should do expected thing when input is valid', () => {
 *             // Arrange
 *             const input = createValidInput()
 *
 *             // Act
 *             const result = performAction(input)
 *
 *             // Assert
 *             expect(result).toHaveProperty('expectedProperty')
 *             expect(result.expectedProperty).toBe(expectedValue)
 *         })
 *     })
 *
 *     describe('edge cases', () => {
 *         it('should handle empty input gracefully', () => {
 *             // Test edge case
 *         })
 *
 *         it('should throw error for invalid input', () => {
 *             expect(() => performAction(invalidInput)).toThrow()
 *         })
 *     })
 * })
 */
