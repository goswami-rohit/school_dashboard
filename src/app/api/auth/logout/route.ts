// src/app/api/auth/logout/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
	await destroySession();
	return NextResponse.json({ message: "Logged out", redirect: "/login" });
}