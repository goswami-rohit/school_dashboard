// src/app/api/auth/login/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/drizzle";
import { users } from "../../../../../drizzle";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = loginSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0]?.message ?? "Invalid input." },
				{ status: 400 }
			);
		}

		const { email, password } = parsed.data;

		const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (!user) {
			return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
		}

		const passwordMatches = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatches) {
			return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
		}

		await createSession({
			userId: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		});

		return NextResponse.json({ message: "Login successful", redirect: "/dashboard" });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
	}
}