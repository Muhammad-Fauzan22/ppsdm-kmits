import { describe, it, expect } from 'vitest'
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

        it('should return empty string for null/undefined', () => {
            expect(convertDriveToDirectLink(null)).toBe('')
            expect(convertDriveToDirectLink(undefined)).toBe('')
        })

        it('should return original string if invalid drive link', () => {
            const input = 'https://example.com/file.pdf'
            expect(convertDriveToDirectLink(input)).toBe(input)
        })
    })
})
