// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { decrypt, COOKIE_NAME } from "./lib/auth";

export async function proxy(request: NextRequest) {
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

	if (!isValidSession && isProtectedApi) {
		return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
	}

	if (!isValidSession && isProtectedPage) {
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete(COOKIE_NAME);
		return response;
	}

	if (isValidSession && isLoginRoute) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};