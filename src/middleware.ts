import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    // 1. Setup Response & Supabase Client
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 2. Cek Session User
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();

    // 3. Security Logic: Proteksi Dashboard & Role Based Access Control
    const path = request.nextUrl.pathname;

    // Public routes that don't need auth
    const isPublicRoute =
        path === "/" ||
        path.startsWith("/auth") ||
        path.startsWith("/help") ||
        path.startsWith("/research") ||
        path.startsWith("/api/public") ||
        path.startsWith("/assessment") ||
        path.startsWith("/try-assessment");

    if (isPublicRoute) {
        // Jika user sudah login tapi buka halaman login/register, redirect ke dashboard masing-masing
        if (user && (path.startsWith("/auth/login") || path.startsWith("/auth/register"))) {
            const role = user.user_metadata?.role || "student";

            if (role === "admin") url.pathname = "/admin";
            else if (role === "lecturer" || role === "supervisor") url.pathname = "/supervisor";
            else url.pathname = "/dashboard";

            return NextResponse.redirect(url);
        }
        return response;
    }

    // Jika belum login, redirect ke login
    if (!user) {
        url.pathname = "/auth/login";
        url.searchParams.set("next", path);
        return NextResponse.redirect(url);
    }

    // Role Based Access Control (RBAC)
    const userRole = user.user_metadata?.role || "student";

    // 1. Admin Zone Protection
    if (path.startsWith("/admin")) {
        if (userRole !== "admin" && userRole !== "superadmin") {
            // Unauthorized for Admin
            url.pathname = "/dashboard"; // Fallback to student dashboard
            return NextResponse.redirect(url);
        }
    }

    // 2. Supervisor Zone Protection
    if (path.startsWith("/supervisor") || path.startsWith("/mentorship")) {
        if (userRole !== "lecturer" && userRole !== "supervisor" && userRole !== "admin") {
            // Unauthorized for Supervisor
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    // 3. Student Zone Protection (Optional: Prevent Admin/Supervisor logic if needed, or keep open)
    // Generally Admins/Supervisors might want to see student views, so we might not block them.
    // But if strict separation is needed:
    /*
    if (path.startsWith("/dashboard") || path.startsWith("/pos")) {
        if (userRole === "admin") {
             url.pathname = "/admin";
             return NextResponse.redirect(url);
        }
    }
    */
}

export const config = {
    // Matcher agar middleware tidak membebani file statis/gambar
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
