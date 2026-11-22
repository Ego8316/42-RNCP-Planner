import { describe, expect, it } from "bun:test";
import { readDatabaseUrl, readFortyTwoOAuthConfiguration } from "./environment";

describe("Database environment is correctly handled", () => {
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

    it("throws when DATABASE_URL is missing or empty", () => {
        expect(() => readDatabaseUrl({})).toThrow("DATABASE_URL is required");
        expect(() => readDatabaseUrl({ DATABASE_URL: "" })).toThrow("DATABASE_URL is required");
        expect(() => readDatabaseUrl({ DATABASE_URL: "   " })).toThrow("DATABASE_URL is required");
    });

    it("throws when DATABASE_URL is not a valid absolute URL", () => {
        expect(() => readDatabaseUrl({ DATABASE_URL: "not a URL" })).toThrow();
    });

    it("throws for a non-PostgreSQL protocol such as sqlite", () => {
        expect(() => readDatabaseUrl({ DATABASE_URL: "sqlite://address" })).toThrow(
            "DATABASE_URL must use the postgres or postgresql protocol",
        );
    });
});

describe("42 OAuth environment is correctly handled", () => {
    it("returns a valid 42 OAuth configuration when using http", () => {
        const configuration = readFortyTwoOAuthConfiguration({
            FORTY_TWO_CLIENT_ID: "non-empty",
            FORTY_TWO_REDIRECT_URI: "http://example.com",
        });

        expect(configuration).toEqual({
            clientId: "non-empty",
            redirectUri: "http://example.com",
        });
    });

    it("returns a valid 42 OAuth configuration when using https", () => {
        const configuration = readFortyTwoOAuthConfiguration({
            FORTY_TWO_CLIENT_ID: "non-empty",
            FORTY_TWO_REDIRECT_URI: "https://example.com",
        });

        expect(configuration).toEqual({
            clientId: "non-empty",
            redirectUri: "https://example.com",
        });
    });

    it("throws when FORTY_TWO_CLIENT_ID is missing or empty", () => {
        expect(() =>
            readFortyTwoOAuthConfiguration({ FORTY_TWO_REDIRECT_URI: "non-empty" }),
        ).toThrow("FORTY_TWO_CLIENT_ID is required");
        expect(() =>
            readFortyTwoOAuthConfiguration({
                FORTY_TWO_CLIENT_ID: "",
                FORTY_TWO_REDIRECT_URI: "non-empty",
            }),
        ).toThrow("FORTY_TWO_CLIENT_ID is required");
        expect(() =>
            readFortyTwoOAuthConfiguration({
                FORTY_TWO_CLIENT_ID: "   ",
                FORTY_TWO_REDIRECT_URI: "non-empty",
            }),
        ).toThrow("FORTY_TWO_CLIENT_ID is required");
    });

    it("throws when FORTY_TWO_REDIRECT_URI is missing or empty", () => {
        expect(() => readFortyTwoOAuthConfiguration({ FORTY_TWO_CLIENT_ID: "non-empty" })).toThrow(
            "FORTY_TWO_REDIRECT_URI is required",
        );
        expect(() =>
            readFortyTwoOAuthConfiguration({
                FORTY_TWO_CLIENT_ID: "non-empty",
                FORTY_TWO_REDIRECT_URI: "",
            }),
        ).toThrow("FORTY_TWO_REDIRECT_URI is required");
        expect(() =>
            readFortyTwoOAuthConfiguration({
                FORTY_TWO_CLIENT_ID: "non-empty",
                FORTY_TWO_REDIRECT_URI: "   ",
            }),
        ).toThrow("FORTY_TWO_REDIRECT_URI is required");
    });

    it("throws when FORTY_TWO_REDIRECT_URI is not a valid absolute URL", () => {
        expect(() =>
            readFortyTwoOAuthConfiguration({
                FORTY_TWO_CLIENT_ID: "non-empty",
                FORTY_TWO_REDIRECT_URI: "not a URL",
            }),
        ).toThrow();
    });

    it("throws when not using http or https for 42 redirect URI", () => {
        expect(() =>
            readFortyTwoOAuthConfiguration({
                FORTY_TWO_CLIENT_ID: "non-empty",
                FORTY_TWO_REDIRECT_URI: "NOT-HTTP://example.com",
            }),
        ).toThrow("FORTY_TWO_REDIRECT_URI must use the http or https protocol");
    });
});
