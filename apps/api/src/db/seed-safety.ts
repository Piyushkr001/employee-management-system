export type SeedSafetyInput = {
  nodeEnv?: string;
  allowDemoSeed?: string;
  databaseUrl?: string;
};

export function assertSafeSeedEnvironment(input: SeedSafetyInput): void {
  const isProduction = input.nodeEnv === "production";
  const explicitlyAllowed = input.allowDemoSeed === "true";

  if (isProduction && !explicitlyAllowed) {
    throw new Error("Refusing to seed demo data in production");
  }

  if (!input.databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const parsed = new URL(input.databaseUrl);
  const databaseName = parsed.pathname.replace(/^\/+/, "");
  const looksSafe = /(^|[_-])(dev|development|local|test)($|[_-])/i.test(databaseName);

  if (!looksSafe && !explicitlyAllowed) {
    throw new Error(`Refusing to seed unsafe database: ${databaseName}`);
  }
}
