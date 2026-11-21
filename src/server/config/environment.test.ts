import { describe, expect, it } from "bun:test";
import { readDatabaseUrl } from "./environment";

describe("Environment is correct", () => {
    it("returns a valid PostgreSQL URL when protocol is postgres", () => {
        const address = "postgres://database_address";
        const value = readDatabaseUrl({ DATABASE_URL: address });

        expect(value).toEqual(address);
    });

    it("returns a valid PostgreSQL URL when protocol is postgresql", () => {
        const address = "postgresql://database_address";
        const value = readDatabaseUrl({ DATABASE_URL: address });

        expect(value).toEqual(address);
    });

    it("throws when DATABASE_URL is missing", () => {
        expect(() => readDatabaseUrl({})).toThrow("DATABASE_URL is required");
    });

    it("throws for a non-PostgreSQL protocol such as sqlite", () => {
        expect(() => readDatabaseUrl({ DATABASE_URL: "sqlite://address" })).toThrow(
            "DATABASE_URL must use the postgres or postgresql protocol",
        );
    });
});
