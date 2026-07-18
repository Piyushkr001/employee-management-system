DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('super_admin', 'hr_manager', 'employee');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"department" varchar(100) NOT NULL,
	"designation" varchar(100) NOT NULL,
	"salary" integer DEFAULT 0 NOT NULL,
	"joining_date" date,
	"status" "status" DEFAULT 'active' NOT NULL,
	"role" "role" DEFAULT 'employee' NOT NULL,
	"manager_id" uuid,
	"profile_image_url" varchar(255),
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_employee_code_unique" UNIQUE("employee_code"),
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_id_employees_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "employees" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "employee_code_idx" ON "employees" USING btree ("employee_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "manager_id_idx" ON "employees" USING btree ("manager_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "department_idx" ON "employees" USING btree ("department");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_idx" ON "employees" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "employees" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "joining_date_idx" ON "employees" USING btree ("joining_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deleted_at_idx" ON "employees" USING btree ("deleted_at");