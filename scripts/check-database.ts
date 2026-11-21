import { readDatabaseUrl } from "@/server/config/environment";
import { createDatabaseClient } from "@/server/database/client";

type DatabaseInformation = {
    database: string;
    databaseUser: string;
    serverTime: Date;
};

const database = createDatabaseClient(readDatabaseUrl());

try {
    const [information] = await database<DatabaseInformation[]>`
        SELECT
            current_database() AS database,
            current_user AS "databaseUser",
            CURRENT_TIMESTAMP AS "serverTime";
    `;

    if (!information) {
        throw new Error("PostgreSQL returned no health information");
    }

    console.log(information);
} finally {
    await database.close({ timeout: 5 });
}
