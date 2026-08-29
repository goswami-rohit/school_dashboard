import { NextRequest, NextResponse } from "next/server";
import { decrypt, COOKIE_NAME } from "./lib/auth";

const allowedOrigins = [
    "https://demo.brixta.site",
    "http://demo.brixta.site",
    "http://localhost:3000",
];

export async function proxy(request: NextRequest) {
    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // 1. Handle CORS Preflight (OPTIONS request)
    if (request.method === "OPTIONS") {
        const preflightHeaders = {
            ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    const isProtectedPage = pathname.startsWith("/dashboard");
    const isProtectedApi =
        pathname.startsWith("/api/students") || pathname.startsWith("/api/payments");
    const isLoginRoute = pathname === "/login";

    let isValidSession = false;
    if (token) {
        const payload = await decrypt(token);
        isValidSession = !!payload;
    }

    // 2. Default to passing the request forward
    let response = NextResponse.next();

    // 3. Apply Auth Routing Logic
    if (!isValidSession && isProtectedApi) {
        response = NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    } else if (!isValidSession && isProtectedPage) {
        response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete(COOKIE_NAME);
    } else if (isValidSession && isLoginRoute) {
        response = NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4. Attach CORS headers to the final response
    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};