import { z } from "zod";

// Schema Pendaftaran Peserta (Strict Mode)
export const registerSchema = z.object({
    fullName: z
        .string()
        .min(3, { message: "Nama lengkap minimal 3 karakter" })
        .max(100, { message: "Nama lengkap maksimal 100 karakter" })
        .regex(/^[a-zA-Z\s.,']+$/, { message: "Nama hanya boleh berisi huruf dan tanda baca standar" }),

    // Validasi NRP: Wajib 10 digit angka
    nrp: z
        .string()
        .length(10, { message: "NRP wajib terdiri dari tepat 10 digit angka" })
        .regex(/^\d+$/, { message: "NRP hanya boleh berisi angka" }),

    // Validasi Email: Wajib domain ITS
    email: z
        .string()
        .email({ message: "Format email tidak valid" })
        .refine((email) => email.endsWith("@student.its.ac.id") || email.endsWith("@its.ac.id"), {
            message: "Wajib menggunakan email resmi ITS (@student.its.ac.id atau @its.ac.id)",
        }),

    // Password Policy: Standar keamanan modern
    password: z
        .string()
        .min(8, { message: "Password minimal 8 karakter" })
        .regex(/[A-Z]/, { message: "Password wajib mengandung minimal 1 huruf besar" })
        .regex(/[0-9]/, { message: "Password wajib mengandung minimal 1 angka" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password disarankan mengandung simbol unik (!@#$)" }),

    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password konfirmasi tidak cocok",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
