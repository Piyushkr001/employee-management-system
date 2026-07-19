export function getSafeRedirect(
  value: string | null,
  role: string
): string | null {
  if (!value) return null;

  // Prevent external or protocol-relative redirects
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//") ||
    value.startsWith("javascript:") ||
    value.startsWith("data:")
  ) {
    return null;
  }

  // Validate safe paths
  const isValidPath = value.startsWith("/") && !value.startsWith("//");

  if (!isValidPath) return null;

  // Enforce role checks
  if (role === "employee" && value !== "/profile") {
    return null; // Employees can only redirect to profile
  }

  return value;
}
