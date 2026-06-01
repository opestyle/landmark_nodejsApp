import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertContact, contacts, Contact } from "../drizzle/schema";
import { logger } from "./logger";

let _db: ReturnType<typeof drizzle> | null = null;
let _dbAvailable: boolean | null = null; // null = not yet checked

/**
 * Lazily initialise the Drizzle ORM instance.
 *
 * Returns the drizzle instance when DATABASE_URL is set and the connection
 * succeeds. Returns null when DATABASE_URL is absent or the DB is unreachable.
 *
 * NOTE: There is intentionally NO in-memory fallback. Callers must check the
 * return value and surface a proper "database unavailable" error to the client.
 * This design is used to demonstrate Kubernetes dependency ordering — the app
 * pod starts and serves the UI, but write operations fail gracefully until the
 * database StatefulSet is deployed.
 */
export async function getDb(): Promise<ReturnType<typeof drizzle> | null> {
  if (_db) return _db;

  if (!process.env.DATABASE_URL) {
    if (_dbAvailable !== false) {
      logger.warn("[Database] DATABASE_URL is not set — database features are disabled.");
      _dbAvailable = false;
    }
    return null;
  }

  try {
    const pool = mysql.createPool(process.env.DATABASE_URL);
    // Verify the connection is actually reachable before caching the instance.
    await pool.query("SELECT 1");
    _db = drizzle(pool);
    _dbAvailable = true;
    logger.info("[Database] Connected successfully.");
    return _db;
  } catch (error) {
    _dbAvailable = false;
    logger.warn(`[Database] Connection failed: ${error}`);
    return null;
  }
}

/**
 * Returns true when the database is reachable, false otherwise.
 * Used by the /api/db-status health endpoint.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  await getDb();
  return _dbAvailable === true;
}

/**
 * Reset the cached connection state. Useful in tests.
 */
export function resetDbConnection(): void {
  _db = null;
  _dbAvailable = null;
}

// ---------------------------------------------------------------------------
// Data access functions
// ---------------------------------------------------------------------------

/**
 * Create a new contact.
 * @throws {Error} "DATABASE_UNAVAILABLE" when the database is not reachable.
 */
export async function createContact(data: InsertContact): Promise<Contact> {
  const db = await getDb();

  if (!db) {
    logger.warn("[Database] createContact called but database is unavailable.");
    throw new Error("DATABASE_UNAVAILABLE");
  }

  await db.insert(contacts).values(data);
  const [inserted] = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt))
    .limit(1);

  if (!inserted) {
    throw new Error("Failed to retrieve the newly created contact.");
  }

  logger.info(`[Contact] Created id=${inserted.id} name=${inserted.name}`);
  return inserted;
}

/**
 * Return all contacts ordered by most-recent first.
 * Returns an empty array when the database is unavailable.
 */
export async function getContacts(): Promise<Contact[]> {
  const db = await getDb();

  if (!db) {
    logger.warn("[Database] getContacts — database unavailable, returning [].");
    return [];
  }

  try {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  } catch (error) {
    logger.error(`[Database] getContacts failed: ${error}`);
    return [];
  }
}

/**
 * Delete a contact by id.
 * @throws {Error} "DATABASE_UNAVAILABLE" when the database is not reachable.
 */
export async function deleteContact(id: number): Promise<boolean> {
  const db = await getDb();

  if (!db) {
    logger.warn("[Database] deleteContact called but database is unavailable.");
    throw new Error("DATABASE_UNAVAILABLE");
  }

  try {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  } catch (error) {
    logger.error(`[Database] deleteContact id=${id} failed: ${error}`);
    return false;
  }
}
