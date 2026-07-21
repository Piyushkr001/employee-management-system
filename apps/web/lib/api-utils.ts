export function getInternalApiUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;

  if (internalUrl) {
    return internalUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("API_INTERNAL_URL is required in production");
  }

  return "http://localhost:5000/api";
}
