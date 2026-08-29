// src/app/api/students/route.ts
export const dynamic = "force-dynamic";

import { connection } from "next/server";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { students } from "../../../../drizzle";
import { createStudentSchema } from "@/lib/validations";

export async function GET() {
	await connection();

	try {
		const rows = await db.select().from(students).orderBy(desc(students.createdAt));
		return NextResponse.json({ students: rows });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Could not load students." }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = createStudentSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0]?.message ?? "Invalid input." },
				{ status: 400 }
			);
		}

		const data = parsed.data;

		const [row] = await db
			.insert(students)
			.values({
				admissionNo: data.admissionNo,
				name: data.name,
				class: data.class,
				section: data.section || null,
				rollNo: data.rollNo || null,
				classTeacher: data.classTeacher || null,
				fatherName: data.fatherName || null,
				fatherPhone: data.fatherPhone || null,
				motherName: data.motherName || null,
				motherPhone: data.motherPhone || null,
				address: data.address || null,
				busNo: data.busNo || null,
				hasSiblingInSchool: data.hasSiblingInSchool,
				siblingName: data.siblingName || null,
				siblingClass: data.siblingClass || null,
			})
			.returning();

		return NextResponse.json({ student: row }, { status: 201 });
	} catch (err) {
		console.error(err);
		const message = err instanceof Error ? err.message : "Could not save student.";
		const isDuplicate = message.toLowerCase().includes("unique");
		return NextResponse.json(
			{ error: isDuplicate ? "Admission number already exists." : message },
			{ status: 500 }
		);
	}
}
