import { createApi } from "./api";
import { createOAuthState } from "./auth/state";
import { readDatabaseUrl, readFortyTwoOAuthConfiguration } from "./config/environment";
import { createDatabaseClient } from "./database/client";
import { pingDatabase } from "./database/health";

export const database = createDatabaseClient(readDatabaseUrl());

export const api = createApi({
    pingDatabase: () => pingDatabase(database),
    authRouteDependencies: {
        oauthConfiguration: readFortyTwoOAuthConfiguration(),
        createState: createOAuthState,
        secureCookies: process.env.NODE_ENV === "production",
    },
});
