import { describe, beforeAll, afterAll } from "bun:test";
import { setupTestDatabase, closeTestDatabase } from "./setup";
import { testClient } from "./test-db";

describe("Database Integration Tests (Serial)", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  require("./migrations.cases.ts");
  require("./constraints.cases.ts");
  require("./transactional-creation.cases.ts");
  require("./hierarchy.cases.ts");
  require("./soft-delete.cases.ts");
  require("./authorization.cases.ts");
  require("./super-admin.cases.ts");
  require("./auth-db.cases.ts");
  require("./http-postgres.cases.ts");
  require("./filter-options.cases.ts");
});
