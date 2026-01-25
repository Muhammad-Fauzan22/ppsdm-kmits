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

    // 3. Security Logic: Proteksi Dashboard (Route Guard)
    if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/profile")) {
        if (!user) {
            // Jika belum login, tendang ke halaman login dengan callback URL
            url.pathname = "/login";
            url.searchParams.set("next", request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }
    }

    // 4. Security Logic: Cegah User Login masuk ke halaman Auth lagi
    if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
        if (user) {
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    // Matcher agar middleware tidak membebani file statis/gambar
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
