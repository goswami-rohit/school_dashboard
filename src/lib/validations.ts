// src/lib/validations.ts
import { z } from "zod";

export const createStudentSchema = z.object({
	admissionNo: z.string().trim().min(1, "Admission no. is required"),
	name: z.string().trim().min(1, "Name is required"),
	class: z.string().trim().min(1, "Class is required"),
	section: z.string().trim().optional().nullable(),
	rollNo: z.string().trim().optional().nullable(),
	classTeacher: z.string().trim().optional().nullable(),
	fatherName: z.string().trim().optional().nullable(),
	fatherPhone: z.string().trim().optional().nullable(),
	motherName: z.string().trim().optional().nullable(),
	motherPhone: z.string().trim().optional().nullable(),
	address: z.string().trim().optional().nullable(),
	busNo: z.string().trim().optional().nullable(),
	hasSiblingInSchool: z.boolean().default(false),
	siblingName: z.string().trim().optional().nullable(),
	siblingClass: z.string().trim().optional().nullable(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const createPaymentSchema = z.object({
	studentId: z.coerce.number().int().positive("Select a student"),
	totalAmount: z.coerce.number().nonnegative("Total amount must be 0 or more"),
	amountPaid: z.coerce.number().nonnegative().default(0),
	paidOnDate: z.string().trim().optional().nullable(),
	nextPayDueDate: z.string().trim().optional().nullable(),
	hasPaidAdvance: z.boolean().default(false),
	advancePayAmount: z.coerce.number().nonnegative().optional().nullable(),
	mode: z
		.enum(["cash", "upi", "card", "bank_transfer", "cheque", "other"])
		.optional()
		.nullable(),
	remarks: z.string().trim().optional().nullable(),
});


export const loginSchema = z.object({
	email: z.string().trim().toLowerCase().email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
