type Environment = Readonly<Record<string, string | undefined>>;

export type FortyTwoOAuthConfiguration = {
    clientId: string;
    redirectUri: string;
};

export function readDatabaseUrl(environment: Environment = process.env): string {
    const value = environment.DATABASE_URL;
    if (!value?.trim()) {
        throw new Error("DATABASE_URL is required");
    }

    const url = new URL(value);
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
        throw new Error("DATABASE_URL must use the postgres or postgresql protocol");
    }

    return value;
}

export function readFortyTwoOAuthConfiguration(
    environment: Environment = process.env,
): FortyTwoOAuthConfiguration {
    const clientId = environment.FORTY_TWO_CLIENT_ID;
    if (!clientId?.trim()) {
        throw new Error("FORTY_TWO_CLIENT_ID is required");
    }

    const redirectUri = environment.FORTY_TWO_REDIRECT_URI;
    if (!redirectUri?.trim()) {
        throw new Error("FORTY_TWO_REDIRECT_URI is required");
    }

    const uri = new URL(redirectUri);
    if (uri.protocol !== "http:" && uri.protocol !== "https:") {
        throw new Error("FORTY_TWO_REDIRECT_URI must use the http or https protocol");
    }

    return { clientId, redirectUri };
}
