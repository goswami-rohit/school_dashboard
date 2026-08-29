// src/app/api/payments/route.ts
export const dynamic = "force-dynamic";

import { connection } from "next/server";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { payments, students } from "../../../../drizzle";
import { createPaymentSchema } from "@/lib/validations";

export async function GET() {
	await connection();

	try {
		const rows = await db
			.select({
				id: payments.id,
				studentId: payments.studentId,
				studentName: students.name,
				admissionNo: students.admissionNo,
				totalAmount: payments.totalAmount,
				amountPaid: payments.amountPaid,
				amountPending: payments.amountPending,
				paidOnDate: payments.paidOnDate,
				nextPayDueDate: payments.nextPayDueDate,
				hasPaidAdvance: payments.hasPaidAdvance,
				advancePayAmount: payments.advancePayAmount,
				mode: payments.mode,
			})
			.from(payments)
			.innerJoin(students, eq(students.id, payments.studentId))
			.orderBy(desc(payments.createdAt));

		return NextResponse.json({ payments: rows });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Could not load payments." }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = createPaymentSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0]?.message ?? "Invalid input." },
				{ status: 400 }
			);
		}

		const data = parsed.data;
		const amountPending = Math.max(data.totalAmount - data.amountPaid, 0);

		const [row] = await db
			.insert(payments)
			.values({
				studentId: data.studentId,
				totalAmount: String(data.totalAmount),
				amountPaid: String(data.amountPaid),
				amountPending: String(amountPending),
				paidOnDate: data.paidOnDate || null,
				nextPayDueDate: data.nextPayDueDate || null,
				hasPaidAdvance: data.hasPaidAdvance,
				advancePayAmount:
					data.hasPaidAdvance && data.advancePayAmount != null
						? String(data.advancePayAmount)
						: null,
				mode: data.mode || null,
				remarks: data.remarks || null,
			})
			.returning();

		return NextResponse.json({ payment: row }, { status: 201 });
	} catch (err) {
		console.error(err);
		const message = err instanceof Error ? err.message : "Could not save payment.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
