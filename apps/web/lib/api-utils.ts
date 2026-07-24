function assertHttpUrl(url: string, varName: string) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(`${varName} must be a valid HTTP or HTTPS URL, got: ${url}`);
  }
}

export function getInternalApiUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;

  if (internalUrl) {
    assertHttpUrl(internalUrl, "API_INTERNAL_URL");
    return internalUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("API_INTERNAL_URL is required in production");
  }

  return "http://localhost:5001/api";
}
