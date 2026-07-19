import { AuthenticatedUserDto, CreateEmployeeInput, UpdateEmployeeInput, UserRole } from "@empnexa/shared";
import { ApiError } from "../../utils/api-error";

type Actor = {
  id: string;
  role: UserRole;
};

type TargetEmployee = {
  id: string;
  role: UserRole;
  deletedAt: Date | null;
};

export function canListEmployees(actor: Actor): boolean {
  return actor.role === "super_admin" || actor.role === "hr_manager";
}

export function canViewEmployee(actor: Actor, target: TargetEmployee): boolean {
  if (actor.role === "super_admin" || actor.role === "hr_manager") {
    return true;
  }
  return actor.id === target.id;
}

export function canCreateEmployee(actor: Actor, input: CreateEmployeeInput): boolean {
  if (actor.role === "super_admin") {
    return true;
  }
  
  if (actor.role === "hr_manager") {
    return input.role !== "super_admin";
  }

  return false;
}

export function canUpdateEmployee(actor: Actor, target: TargetEmployee): boolean {
  if (actor.role === "super_admin") {
    return true;
  }
  
  if (actor.role === "hr_manager") {
    return target.role !== "super_admin";
  }
  
  // Employees can update themselves (but only specific fields which is handled by filtering)
  return actor.id === target.id;
}

export function assertAllowedUpdateFields(actor: Actor, target: TargetEmployee, input: UpdateEmployeeInput): void {
  if (actor.role === "super_admin") {
    return;
  }

  if (actor.role === "hr_manager") {
    if (input.role === "super_admin") {
      throw new ApiError(403, "HR Managers cannot assign the Super Admin role", "FORBIDDEN_ROLE_ASSIGNMENT");
    }
    return;
  }

  // Employee self-update
  if (actor.id === target.id) {
    const forbiddenFields = Object.keys(input).filter(
      key => key !== "phone" && key !== "profileImageUrl"
    );

    if (forbiddenFields.length > 0) {
      throw new ApiError(403, `You cannot update ${forbiddenFields.join(", ")}`, "FORBIDDEN_FIELD");
    }
    return;
  }
}

export function filterAllowedUpdateFields(actor: Actor, target: TargetEmployee, input: UpdateEmployeeInput): UpdateEmployeeInput {
  assertAllowedUpdateFields(actor, target, input);
  return input;
}

export function canDeleteEmployee(actor: Actor, target: TargetEmployee): boolean {
  if (actor.role !== "super_admin") {
    return false;
  }
  
  // Super admin cannot delete themselves
  if (actor.id === target.id) {
    return false;
  }
  
  return true;
}
