// drizzle/schema.ts
import {
	pgTable, pgSchema, pgEnum, serial, integer, varchar, text, numeric, boolean,
	date, timestamp, index, uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const schoolSystem = pgSchema("school_system");

export const userRole = schoolSystem.enum("user_role", ["admin", "staff"]);
export const paymentMode = schoolSystem.enum("payment_mode", ["cash", "upi", "card", "bank_transfer", "cheque", "other"]);

export const users = schoolSystem.table("users", {
	id: serial().primaryKey().notNull(),
	name: varchar("name", { length: 150 }).notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	role: userRole("role").notNull().default("staff"),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	uniqueIndex("users_email_key").using("btree", table.email.asc().nullsLast()),
]);

export const students = schoolSystem.table("students", {
	id: serial().primaryKey().notNull(),
	admissionNo: varchar("admission_no", { length: 50 }).notNull(),
	name: varchar("name", { length: 150 }).notNull(),
	class: varchar("class", { length: 20 }).notNull(),
	section: varchar("section", { length: 10 }),
	rollNo: varchar("roll_no", { length: 20 }),
	classTeacher: varchar("class_teacher", { length: 150 }),
	fatherName: varchar("father_name", { length: 150 }),
	fatherPhone: varchar("father_phone", { length: 20 }),
	motherName: varchar("mother_name", { length: 150 }),
	motherPhone: varchar("mother_phone", { length: 20 }),
	address: text("address"),
	busNo: varchar("bus_no", { length: 20 }),
	hasSiblingInSchool: boolean("has_sibling_in_school").default(false).notNull(),
	siblingName: varchar("sibling_name", { length: 150 }),
	siblingClass: varchar("sibling_class", { length: 20 }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	uniqueIndex("students_admission_no_key").using("btree", table.admissionNo.asc().nullsLast()),
	index("idx_students_class_section").using("btree", table.class.asc().nullsLast(), table.section.asc().nullsLast()),
]);

export const payments = schoolSystem.table("payments", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
	totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
	amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).default("0").notNull(),
	amountPending: numeric("amount_pending", { precision: 12, scale: 2 }).default("0").notNull(),
	paidOnDate: date("paid_on_date"),
	nextPayDueDate: date("next_pay_due_date"),
	hasPaidAdvance: boolean("has_paid_advance").default(false).notNull(),
	advancePayAmount: numeric("advance_pay_amount", { precision: 12, scale: 2 }),
	mode: paymentMode("mode"),
	remarks: text("remarks"),
	recordedBy: integer("recorded_by").references(() => users.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_payments_student_id").using("btree", table.studentId.asc().nullsLast()),
]);
