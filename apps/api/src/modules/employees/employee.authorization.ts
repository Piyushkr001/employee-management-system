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

export function assertActorCanCreateEmployee(actor: Actor, input: CreateEmployeeInput): void {
  if (actor.role === "super_admin") {
    return;
  }
  
  if (actor.role === "hr_manager") {
    if (input.role === "super_admin") {
      throw new ApiError(403, "HR Managers cannot create Super Admins", "FORBIDDEN");
    }
    return;
  }

  throw new ApiError(403, "You do not have permission to create employees", "FORBIDDEN");
}

export function assertActorCanUpdateEmployee(actor: Actor, target: TargetEmployee, input: UpdateEmployeeInput): void {
  if (actor.role === "super_admin") {
    return;
  }

  if (actor.role === "hr_manager") {
    if (target.role === "super_admin") {
      throw new ApiError(403, "Cannot modify Super Admin", "CANNOT_MODIFY_SUPER_ADMIN");
    }
    if (input.role === "super_admin") {
      throw new ApiError(403, "HR Managers cannot assign the Super Admin role", "FORBIDDEN");
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

  throw new ApiError(403, "Cannot modify another employee", "FORBIDDEN");
}

export function filterAllowedUpdateFields(actor: Actor, target: TargetEmployee, input: UpdateEmployeeInput): UpdateEmployeeInput {
  assertActorCanUpdateEmployee(actor, target, input);
  return input;
}

export function assertActorCanDeleteEmployee(actor: Actor, target: TargetEmployee): void {
  if (actor.role !== "super_admin") {
    throw new ApiError(403, "You do not have permission to delete employees", "FORBIDDEN");
  }
  
  // Super admin cannot delete themselves
  if (actor.id === target.id) {
    throw new ApiError(403, "Cannot delete yourself", "FORBIDDEN");
  }
}
