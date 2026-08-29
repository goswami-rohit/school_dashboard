// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET must be set.");
}

const key = new TextEncoder().encode(JWT_SECRET);
export const COOKIE_NAME = "auth_token";

export type SessionPayload = {
	userId: number;
	name: string;
	email: string;
	role: "admin" | "staff";
};

export async function encrypt(payload: SessionPayload) {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
	try {
		const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
		return payload as unknown as SessionPayload;
	} catch {
		return null;
	}
}

export async function createSession(payload: SessionPayload) {
	const token = await encrypt(payload);
	const cookieStore = await cookies();

	cookieStore.set(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});
}

export async function destroySession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}

export async function verifySession(): Promise<SessionPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;
	return decrypt(token);
}