import { SQL } from "bun";

const MAX_POOL_CONNECTIONS = 5;
const CONNECTION_IDLE_TIMEOUT_SEC = 30;
const CONNECTION_FAILING_TIMEOUT_SEC = 5;

/**
 * Creates a database client.
 *
 * @param databaseUrl Database address.
 * @returns Database client.
 */
export function createDatabaseClient(databaseUrl: string) {
    return new SQL(databaseUrl, {
        max: MAX_POOL_CONNECTIONS,
        idleTimeout: CONNECTION_IDLE_TIMEOUT_SEC,
        connectionTimeout: CONNECTION_FAILING_TIMEOUT_SEC,
    });
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
