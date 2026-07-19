import { mock } from "bun:test";
import { testDb, testClient } from "./test-db";

mock.module("../../src/db", () => {
  return {
    default: testDb,
    db: testDb,
    client: testClient,
  };
});
