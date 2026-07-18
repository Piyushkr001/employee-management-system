import { AuthenticatedUserDto, CreateEmployeeInput, UpdateEmployeeInput, UserRole } from "@empnexa/shared";

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

export function filterAllowedUpdateFields(actor: Actor, target: TargetEmployee, input: UpdateEmployeeInput): UpdateEmployeeInput {
  if (actor.role === "super_admin") {
    return input;
  }

  if (actor.role === "hr_manager") {
    const allowed = { ...input };
    // HR cannot change role to super_admin
    if (allowed.role === "super_admin") {
      delete allowed.role;
    }
    return allowed;
  }

  // Employee self-update
  if (actor.id === target.id) {
    // Only phone and profileImageUrl are allowed
    const allowed: UpdateEmployeeInput = {};
    if (input.phone !== undefined) allowed.phone = input.phone;
    if (input.profileImageUrl !== undefined) allowed.profileImageUrl = input.profileImageUrl;
    return allowed;
  }

  return {};
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
