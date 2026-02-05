/**
 * VALIDATION SCHEMAS - PPSDM KMITS
 * 
 * Using Zod for runtime type validation
 * All API routes should validate input using these schemas
 * 
 * Open Source: Zod (https://github.com/colinhacks/zod)
 */

import { z } from 'zod';

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
});

/**
 * Signup validation schema
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s\u00C0-\u00FF]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  nrp: z
    .string()
    .min(10, 'NRP minimal 10 digit')
    .max(15, 'NRP maksimal 15 digit')
    .regex(/^\d+$/, 'NRP hanya boleh mengandung angka'),
  department: z
    .string()
    .min(2, 'Jurusan minimal 2 karakter')
    .max(100, 'Jurusan terlalu panjang')
    .optional(),
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .transform(val => val.toLowerCase().trim()),
});

/**
 * Password update schema
 */
export const passwordUpdateSchema = z.object({
  current_password: z
    .string()
    .min(1, 'Password saat ini wajib diisi'),
  new_password: z
    .string()
    .min(8, 'Password baru minimal 8 karakter')
    .max(128, 'Password baru terlalu panjang')
    .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
});

// ============================================================================
// ASSESSMENT SCHEMAS
// ============================================================================

/**
 * Assessment response schema
 */
export const assessmentResponseSchema = z.object({
  questionId: z.string().uuid('ID pertanyaan tidak valid'),
  answer: z.union([
    z.string().max(1000, 'Jawaban terlalu panjang'),
    z.number().min(1).max(10, 'Nilai harus antara 1-10'),
    z.array(z.string().max(500)).max(10, 'Maksimal 10 pilihan'),
  ]),
  timestamp: z.string().datetime().optional(),
});

/**
 * Holistic assessment schema
 */
export const holisticAssessmentSchema = z.object({
  dimensionId: z
    .number()
    .int('ID dimensi harus bilangan bulat')
    .min(1, 'ID dimensi minimal 1')
    .max(9, 'ID dimensi maksimal 9'),
  responses: z
    .array(assessmentResponseSchema)
    .min(1, 'Minimal 1 jawaban')
    .max(100, 'Maksimal 100 jawaban'),
  userContext: z.object({
    age: z.number().int().min(0).max(120).optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    department: z.string().max(100).optional(),
    year: z.number().int().min(1).max(7).optional(),
  }).optional(),
});

/**
 * Assessment submission schema
 */
export const assessmentSubmissionSchema = z.object({
  assessmentId: z.string().uuid('ID assessment tidak valid'),
  responses: z
    .record(z.string().uuid(), z.union([
      z.string().max(1000),
      z.number().min(1).max(10),
      z.array(z.string().max(500)).max(10),
    ]))
    .refine(data => Object.keys(data).length >= 1, 'Minimal 1 jawaban')
    .refine(data => Object.keys(data).length <= 200, 'Maksimal 200 jawaban'),
});

// ============================================================================
// COURSE SCHEMAS
// ============================================================================

/**
 * Course enrollment schema
 */
export const courseEnrollmentSchema = z.object({
  courseId: z.string().uuid('ID kursus tidak valid'),
});

/**
 * Course progress schema
 */
export const courseProgressSchema = z.object({
  courseId: z.string().uuid('ID kursus tidak valid'),
  lessonId: z.string().uuid('ID pelajaran tidak valid'),
  completed: z.boolean().optional(),
  timeSpent: z.number().int().min(0).optional(),
});

/**
 * Course review schema
 */
export const courseReviewSchema = z.object({
  courseId: z.string().uuid('ID kursus tidak valid'),
  rating: z.number().int().min(1).max(5, 'Rating harus antara 1-5'),
  comment: z.string().max(1000, 'Komentar terlalu panjang').optional(),
});

// ============================================================================
// USER PROFILE SCHEMAS
// ============================================================================

/**
 * User profile update schema
 */
export const userProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s\u00C0-\u00FF]+$/, 'Nama hanya boleh mengandung huruf dan spasi')
    .optional(),
  bio: z.string().max(500, 'Bio terlalu panjang').optional(),
  avatar_url: z.string().url('URL avatar tidak valid').optional(),
  department: z.string().max(100, 'Jurusan terlalu panjang').optional(),
  year: z.number().int().min(1).max(7).optional(),
  phone: z.string().regex(/^\+?[0-9\s\-]{10,15}$/, 'Nomor telepon tidak valid').optional(),
  linkedin: z.string().url('URL LinkedIn tidak valid').optional(),
  github: z.string().url('URL GitHub tidak valid').optional(),
});

/**
 * User settings schema
 */
export const userSettingsSchema = z.object({
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.enum(['id', 'en']).optional(),
  timezone: z.string().optional(),
});

// ============================================================================
// ACTIVITY SCHEMAS
// ============================================================================

/**
 * Activity creation schema
 */
export const activitySchema = z.object({
  title: z
    .string()
    .min(5, 'Judul minimal 5 karakter')
    .max(200, 'Judul terlalu panjang'),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(2000, 'Deskripsi terlalu panjang'),
  activity_type: z.enum([
    'academic',
    'extracurricular',
    'volunteer',
    'internship',
    'competition',
    'other',
  ]),
  start_date: z.string().datetime('Tanggal mulai tidak valid'),
  end_date: z.string().datetime('Tanggal selesai tidak valid').optional(),
  location: z.string().max(200, 'Lokasi terlalu panjang').optional(),
  tags: z.array(z.string().max(50)).max(10, 'Maksimal 10 tag').optional(),
});

/**
 * Activity update schema
 */
export const activityUpdateSchema = z.object({
  activityId: z.string().uuid('ID aktivitas tidak valid'),
  title: z
    .string()
    .min(5, 'Judul minimal 5 karakter')
    .max(200, 'Judul terlalu panjang')
    .optional(),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(2000, 'Deskripsi terlalu panjang')
    .optional(),
  status: z.enum(['draft', 'ongoing', 'completed']).optional(),
});

// ============================================================================
// FEEDBACK SCHEMAS
// ============================================================================

/**
 * Feedback submission schema
 */
export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'improvement', 'other']),
  subject: z
    .string()
    .min(5, 'Subjek minimal 5 karakter')
    .max(200, 'Subjek terlalu panjang'),
  message: z
    .string()
    .min(10, 'Pesan minimal 10 karakter')
    .max(2000, 'Pesan terlalu panjang'),
  rating: z.number().int().min(1).max(5).optional(),
  page_url: z.string().url('URL halaman tidak valid').optional(),
});

// ============================================================================
// SEARCH SCHEMAS
// ============================================================================

/**
 * Search query schema
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(2, 'Query minimal 2 karakter')
    .max(200, 'Query terlalu panjang'),
  type: z.enum(['all', 'courses', 'activities', 'users']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sort: z.enum(['relevance', 'date', 'name']).optional(),
});

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  filename: z.string().max(255, 'Nama file terlalu panjang'),
  filesize: z.number().max(10 * 1024 * 1024, 'Ukuran file maksimal 10MB'), // 10MB
  mimetype: z.enum([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
});

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type HolisticAssessmentInput = z.infer<typeof holisticAssessmentSchema>;
export type AssessmentSubmissionInput = z.infer<typeof assessmentSubmissionSchema>;
export type CourseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>;
export type CourseProgressInput = z.infer<typeof courseProgressSchema>;
export type CourseReviewInput = z.infer<typeof courseReviewSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type ActivityUpdateInput = z.infer<typeof activityUpdateSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
