type Environment = Readonly<Record<string, string | undefined>>;

export function readDatabaseUrl(environment: Environment = process.env): string {
    const value = environment.DATABASE_URL;
    if (!value) {
        throw new Error("DATABASE_URL is required");
    }

    const url = new URL(value);
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
        throw new Error("DATABASE_URL must use the postgres or postgresql protocol");
    }

    return value;
}
