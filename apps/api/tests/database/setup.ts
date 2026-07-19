import { beforeAll, afterAll, beforeEach } from "bun:test";
import db from "../../src/db";
import { employees } from "../../src/db/schema/employees";
import { client } from "../../src/db";

beforeAll(async () => {
  // Any global setup
});

afterAll(async () => {
  // Let the process exit naturally instead of ending shared client
});

// beforeEach(async () => {
//   // We do not clear the table to avoid concurrent test conflicts
// });
