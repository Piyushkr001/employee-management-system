import { describe, beforeAll, afterAll } from "bun:test";
import { setupTestDatabase, closeTestDatabase } from "./setup";
import { testClient } from "./test-db";

describe("Database Integration Tests (Serial)", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
    await testClient.end();
  });

  require("./migrations.test.ts");
  require("./constraints.test.ts");
  require("./transactional-creation.test.ts");
  require("./hierarchy.test.ts");
  require("./soft-delete.test.ts");
  require("./super-admin.test.ts");
  require("./auth-db.test.ts");
});
