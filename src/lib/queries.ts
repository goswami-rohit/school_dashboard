// src/lib/queries.ts
import { db } from "@/lib/drizzle";
import { students, payments } from "../../drizzle";
import { desc, eq, sql } from "drizzle-orm";

export async function getDashboardStats() {
	const [{ totalStudents }] = await db
		.select({ totalStudents: sql<number>`count(*)::int` })
		.from(students);

	const [{ totalDue, totalPaid, totalPending }] = await db
		.select({
			totalDue: sql<number>`coalesce(sum(${payments.totalAmount}), 0)::float`,
			totalPaid: sql<number>`coalesce(sum(${payments.amountPaid}), 0)::float`,
			totalPending: sql<number>`coalesce(sum(${payments.amountPending}), 0)::float`,
		})
		.from(payments);

	const statusCounts = await db
		.select({
			status: sql<string>`case
				when ${payments.amountPending} <= 0 then 'cleared'
				when ${payments.amountPaid} > 0 then 'partial'
				else 'pending'
			end`,
			count: sql<number>`count(*)::int`,
		})
		.from(payments)
		.groupBy(sql`1`);

	const monthly = await db
		.select({
			month: sql<string>`to_char(${payments.paidOnDate}, 'Mon YYYY')`,
			collected: sql<number>`coalesce(sum(${payments.amountPaid}), 0)::float`,
		})
		.from(payments)
		.where(sql`${payments.paidOnDate} is not null`)
		.groupBy(sql`to_char(${payments.paidOnDate}, 'Mon YYYY'), date_trunc('month', ${payments.paidOnDate})`)
		.orderBy(sql`date_trunc('month', ${payments.paidOnDate})`)
		.limit(6);

	const clearedPct = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;
	const pendingPct = totalDue > 0 ? 100 - clearedPct : 0;

	return {
		totalStudents,
		totalDue,
		totalPaid,
		totalPending,
		clearedPct,
		pendingPct,
		statusCounts,
		monthly,
	};
}

export async function getStudents() {
	return db.select().from(students).orderBy(desc(students.createdAt));
}

export async function getStudentsWithBalances() {
	return db
		.select({
			id: students.id,
			admissionNo: students.admissionNo,
			name: students.name,
			class: students.class,
			section: students.section,
			rollNo: students.rollNo,
			classTeacher: students.classTeacher,
			fatherName: students.fatherName,
			fatherPhone: students.fatherPhone,
			motherName: students.motherName,
			motherPhone: students.motherPhone,
			address: students.address,
			busNo: students.busNo,
			hasSiblingInSchool: students.hasSiblingInSchool,
			siblingName: students.siblingName,
			siblingClass: students.siblingClass,
			isActive: students.isActive,
			createdAt: students.createdAt,
			totalDue: sql<number>`coalesce(sum(${payments.totalAmount}), 0)::float`,
			totalPaid: sql<number>`coalesce(sum(${payments.amountPaid}), 0)::float`,
			totalPending: sql<number>`coalesce(sum(${payments.amountPending}), 0)::float`,
		})
		.from(students)
		.leftJoin(payments, eq(payments.studentId, students.id))
		.groupBy(students.id)
		.orderBy(desc(students.createdAt));
}

export async function getPayments() {
	return db
		.select({
			id: payments.id,
			totalAmount: payments.totalAmount,
			amountPaid: payments.amountPaid,
			amountPending: payments.amountPending,
			paidOnDate: payments.paidOnDate,
			nextPayDueDate: payments.nextPayDueDate,
			hasPaidAdvance: payments.hasPaidAdvance,
			advancePayAmount: payments.advancePayAmount,
			mode: payments.mode,
			remarks: payments.remarks,
			createdAt: payments.createdAt,
			studentName: students.name,
			admissionNo: students.admissionNo,
			studentClass: students.class,
			studentSection: students.section,
		})
		.from(payments)
		.innerJoin(students, eq(students.id, payments.studentId))
		.orderBy(desc(payments.createdAt));
}
