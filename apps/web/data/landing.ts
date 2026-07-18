import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  CircleUserRound,
  Database,
  GitBranch,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  UserRoundCheck,
  Users,
  Zap,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Role = {
  name: string;
  description: string;
  icon: LucideIcon;
  permissions: string[];
};

export const platformHighlights = [
  {
    label: "Secure authentication",
    icon: LockKeyhole,
  },
  {
    label: "Role-based access",
    icon: ShieldCheck,
  },
  {
    label: "Employee management",
    icon: Users,
  },
  {
    label: "Reporting hierarchy",
    icon: GitBranch,
  },
];

export const features: Feature[] = [
  {
    title: "Employee management",
    description:
      "Create, update, search and manage employee records from a centralized and intuitive workspace.",
    icon: Users,
  },
  {
    title: "Role-based access",
    description:
      "Protect sensitive operations with dedicated permissions for Super Admins, HR Managers and Employees.",
    icon: ShieldCheck,
  },
  {
    title: "Organization hierarchy",
    description:
      "Assign reporting managers, display direct reports and visualize your complete organizational structure.",
    icon: Network,
  },
  {
    title: "Workforce analytics",
    description:
      "Track total employees, workforce status, departments and organizational trends from a focused dashboard.",
    icon: BarChart3,
  },
  {
    title: "Powerful discovery",
    description:
      "Find employees quickly using search, department, role and status filters with flexible sorting.",
    icon: Search,
  },
  {
    title: "Secure employee data",
    description:
      "Keep workforce information protected with JWT authentication, password hashing and validated APIs.",
    icon: Database,
  },
];

export const roles: Role[] = [
  {
    name: "Super Admin",
    description:
      "Complete organizational control for system administrators and business owners.",
    icon: UserCog,
    permissions: [
      "Manage all employee records",
      "Assign roles and reporting managers",
      "Delete or deactivate employees",
      "Access workforce analytics",
    ],
  },
  {
    name: "HR Manager",
    description:
      "Focused employee operations and workforce administration for HR teams.",
    icon: BriefcaseBusiness,
    permissions: [
      "Create and edit employees",
      "View organization records",
      "Assign reporting managers",
      "Manage employee lifecycle",
    ],
  },
  {
    name: "Employee",
    description:
      "A secure self-service experience that keeps individual employees connected.",
    icon: CircleUserRound,
    permissions: [
      "View personal profile",
      "Update permitted information",
      "View reporting manager",
      "Access role-specific workspace",
    ],
  },
];

export const securityItems = [
  "JWT-based protected sessions",
  "bcrypt password hashing",
  "Backend permission enforcement",
  "Frontend and backend validation",
  "Protected routes and APIs",
  "Circular reporting prevention",
];

export const employeeRows = [
  {
    initials: "AK",
    name: "Aarav Kumar",
    department: "Engineering",
    role: "Employee",
    status: "Active",
  },
  {
    initials: "SM",
    name: "Sara Mehta",
    department: "Human Resources",
    role: "HR Manager",
    status: "Active",
  },
  {
    initials: "RV",
    name: "Rohan Verma",
    department: "Product",
    role: "Employee",
    status: "Active",
  },
];

export const hierarchyMembers = [
  {
    initials: "AS",
    name: "Ananya Sharma",
    role: "Super Admin",
    className:
      "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  {
    initials: "RM",
    name: "Rahul Mehta",
    role: "HR Manager",
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    initials: "PK",
    name: "Priya Kapoor",
    role: "Engineering Lead",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
];
