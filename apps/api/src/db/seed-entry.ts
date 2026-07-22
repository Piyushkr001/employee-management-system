import { assertSafeSeedEnvironment } from "./seed-safety";

async function main() {
  assertSafeSeedEnvironment({
    nodeEnv: process.env.NODE_ENV,
    allowDemoSeed: process.env.ALLOW_DEMO_SEED,
    databaseUrl: process.env.DATABASE_URL,
  });

  const { runSeed } = await import("./seed-runner");
  await runSeed();
}

void main();
