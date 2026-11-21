import { createApi } from "./api";
import { readDatabaseUrl } from "./config/environment";
import { createDatabaseClient } from "./database/client";
import { pingDatabase } from "./database/health";

export const database = createDatabaseClient(readDatabaseUrl());

export const api = createApi({
    pingDatabase: () => pingDatabase(database),
});
