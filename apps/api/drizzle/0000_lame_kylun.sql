DO $$ BEGIN
 CREATE TYPE "public"."employee_role" AS ENUM('super_admin', 'hr_manager', 'employee');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."employee_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_code" varchar(30) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"department" varchar(100) NOT NULL,
	"designation" varchar(100) NOT NULL,
	"salary_in_paise" integer NOT NULL,
	"joining_date" date NOT NULL,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"role" "employee_role" DEFAULT 'employee' NOT NULL,
	"manager_id" uuid,
	"profile_image_url" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_id_employees_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "employees_employee_code_unique" ON "employees" USING btree ("employee_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "employees_email_unique" ON "employees" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employees_manager_id_idx" ON "employees" USING btree ("manager_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employees_department_idx" ON "employees" USING btree ("department");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employees_role_idx" ON "employees" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employees_status_idx" ON "employees" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employees_joining_date_idx" ON "employees" USING btree ("joining_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employees_deleted_at_idx" ON "employees" USING btree ("deleted_at");