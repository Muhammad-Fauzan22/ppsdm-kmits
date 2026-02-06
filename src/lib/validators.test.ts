import { describe, it, expect } from 'vitest';
import { registerSchema } from './validators';

describe('registerSchema', () => {
  it('accepts a valid ITS registration payload', () => {
    const result = registerSchema.safeParse({
      fullName: 'Budi Santoso',
      nrp: '1234567890',
      email: 'budi@student.its.ac.id',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });

    expect(result.success).toBe(true);
  });

  it('rejects non-ITS email domain', () => {
    const result = registerSchema.safeParse({
      fullName: 'Budi Santoso',
      nrp: '1234567890',
      email: 'budi@gmail.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(' | ');
      expect(messages).toContain('Wajib menggunakan email resmi ITS');
    }
  });

  it('rejects password confirmation mismatch', () => {
    const result = registerSchema.safeParse({
      fullName: 'Budi Santoso',
      nrp: '1234567890',
      email: 'budi@its.ac.id',
      password: 'Password1!',
      confirmPassword: 'Password2!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(' | ');
      expect(messages).toContain('Password konfirmasi tidak cocok');
    }
  });
});
