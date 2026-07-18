const allowedRedirects = new Set([
  "/dashboard",
  "/employees",
  "/organization",
  "/profile",
]);

export function getSafeRedirect(
  value: string | null,
): string | null {
  if (!value) return null;

  if (!allowedRedirects.has(value)) {
    return null;
  }

  return value;
}
