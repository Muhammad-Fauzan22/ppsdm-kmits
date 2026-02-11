import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { POST as signupPOST } from '@/app/api/auth/signup/route';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}));

import { createClient } from '@/lib/supabase/server';

describe('Auth API Routes', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn()
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'student@student.its.ac.id',
        user_metadata: { name: 'Test Student' }
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null
      });

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@student.its.ac.id',
          password: 'password123'
        })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
      expect(data.session).toBeDefined();
    });

    it('should reject invalid email domain', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@gmail.com',
          password: 'password123'
        })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid email domain');
    });

    it('should reject missing email', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'password123'
        })
      });

      const response = await loginPOST(request);
      expect(response.status).toBe(400);
    });

    it('should reject missing password', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@student.its.ac.id'
        })
      });

      const response = await loginPOST(request);
      expect(response.status).toBe(400);
    });

    it('should handle authentication errors', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@student.its.ac.id',
          password: 'wrongpassword'
        })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should signup with valid ITS email', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'newstudent@student.its.ac.id',
        user_metadata: { name: 'New Student' }
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const request = new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newstudent@student.its.ac.id',
          password: 'SecurePass123!',
          name: 'New Student'
        })
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
    });

    it('should reject non-ITS email', async () => {
      const request = new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@gmail.com',
          password: 'SecurePass123!',
          name: 'Student'
        })
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('ITS email');
    });

    it('should reject weak passwords', async () => {
      const request = new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@student.its.ac.id',
          password: '123',
          name: 'Student'
        })
      });

      const response = await signupPOST(request);
      expect(response.status).toBe(400);
    });

    it('should handle signup errors', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Email already registered' }
      });

      const request = new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@student.its.ac.id',
          password: 'SecurePass123!',
          name: 'Existing Student'
        })
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});