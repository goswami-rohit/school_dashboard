CREATE SCHEMA "school_system";
--> statement-breakpoint
CREATE TYPE "school_system"."payment_mode" AS ENUM('cash', 'upi', 'card', 'bank_transfer', 'cheque', 'other');--> statement-breakpoint
CREATE TYPE "school_system"."user_role" AS ENUM('admin', 'staff');--> statement-breakpoint
CREATE TABLE "school_system"."payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"amount_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"amount_pending" numeric(12, 2) DEFAULT '0' NOT NULL,
	"paid_on_date" date,
	"next_pay_due_date" date,
	"has_paid_advance" boolean DEFAULT false NOT NULL,
	"advance_pay_amount" numeric(12, 2),
	"mode" "school_system"."payment_mode",
	"remarks" text,
	"recorded_by" integer,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "school_system"."students" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_no" varchar(50) NOT NULL,
	"name" varchar(150) NOT NULL,
	"class" varchar(20) NOT NULL,
	"section" varchar(10),
	"roll_no" varchar(20),
	"class_teacher" varchar(150),
	"father_name" varchar(150),
	"father_phone" varchar(20),
	"mother_name" varchar(150),
	"mother_phone" varchar(20),
	"address" text,
	"bus_no" varchar(20),
	"has_sibling_in_school" boolean DEFAULT false NOT NULL,
	"sibling_name" varchar(150),
	"sibling_class" varchar(20),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "school_system"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "school_system"."user_role" DEFAULT 'staff' NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "school_system"."payments" ADD CONSTRAINT "payments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "school_system"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_system"."payments" ADD CONSTRAINT "payments_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "school_system"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_payments_student_id" ON "school_system"."payments" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "students_admission_no_key" ON "school_system"."students" USING btree ("admission_no");--> statement-breakpoint
CREATE INDEX "idx_students_class_section" ON "school_system"."students" USING btree ("class","section");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "school_system"."users" USING btree ("email");