ALTER TABLE employees
ADD CONSTRAINT employees_salary_non_negative
CHECK (salary_in_paise >= 0);

--> statement-breakpoint

ALTER TABLE employees
ADD CONSTRAINT employees_manager_not_self
CHECK (manager_id IS NULL OR manager_id <> id);