import { describe, expect, it, beforeEach } from "vitest";
import { createContact, getContacts, deleteContact, resetDbConnection } from "./db";

/**
 * Unit tests for db.ts.
 *
 * These tests run WITHOUT a real database (DATABASE_URL is not set in the test
 * environment). They verify the correct "no fallback" behaviour:
 *
 * - getContacts()   returns an empty array (graceful degradation)
 * - createContact() throws "DATABASE_UNAVAILABLE"
 * - deleteContact() throws "DATABASE_UNAVAILABLE"
 *
 * This design is intentional: the application pod should start and be
 * accessible without a database, but write operations must fail clearly
 * so that Kubernetes readiness probes and the UI can surface the issue.
 */
describe("db — no database available (DATABASE_URL not set)", () => {
  beforeEach(() => {
    // Reset the cached connection state between tests.
    resetDbConnection();
    delete process.env.DATABASE_URL;
  });

  it("getContacts returns an empty array when database is unavailable", async () => {
    const result = await getContacts();
    expect(result).toEqual([]);
  });

  it("createContact throws DATABASE_UNAVAILABLE when database is unavailable", async () => {
    await expect(
      createContact({
        name: "Alice",
        email: "alice@example.com",
        contact: "123456",
        address: "1 Main St",
        country: "USA",
      })
    ).rejects.toThrow("DATABASE_UNAVAILABLE");
  });

  it("deleteContact throws DATABASE_UNAVAILABLE when database is unavailable", async () => {
    await expect(deleteContact(1)).rejects.toThrow("DATABASE_UNAVAILABLE");
  });

  it("getContacts does not throw — it returns [] gracefully", async () => {
    await expect(getContacts()).resolves.toEqual([]);
  });
});
