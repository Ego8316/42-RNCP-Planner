import type { DatabaseClient } from "./client";

export async function pingDatabase(database: DatabaseClient): Promise<void> {
    await database`SELECT 1`;
}
