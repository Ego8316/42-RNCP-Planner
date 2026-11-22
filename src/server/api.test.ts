import { describe, expect, it } from "bun:test";
import { createApi } from "./api";

function createTestApi(pingDatabase: () => Promise<void> = async () => {}) {
    return createApi({
        pingDatabase,
        authRouteDependencies: {
            oauthConfiguration: {
                clientId: "test-client",
                redirectUri: "http://localhost/api/auth/42/callback",
            },
            createState: () => "test-state",
            secureCookies: false,
        },
    });
}

describe("GET /api/auth/42", () => {
    it("mounts the 42 authorization route under the API prefix", async () => {
        const api = createTestApi();

        const response = await api.handle(new Request("http://localhost/api/auth/42"));
        const location = new URL(response.headers.get("location") ?? "");

        expect(response.status).toBe(302);
        expect(location.origin).toBe("https://api.intra.42.fr");
        expect(location.searchParams.get("state")).toBe("test-state");
    });
});

describe("GET /api/hello/:name", () => {
    const api = createTestApi();

    it("greets the supplied name", async () => {
        const response = await api.handle(new Request("http://localhost/api/hello/Ada"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            message: "Hello, Ada",
        });
    });
});

describe("GET /api/hello", () => {
    it("greets without name", async () => {
        const api = createTestApi();

        const response = await api.handle(new Request("http://localhost/api/hello"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            message: "Hello, world!",
            method: "GET",
        });
    });
});

describe("GET /api/health/ready", () => {
    it("shows ready when database check succeeds", async () => {
        const api = createTestApi();

        const response = await api.handle(new Request("http://localhost/api/health/ready"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            status: "ready",
        });
    });

    it("shows unavailable when database check fails", async () => {
        const api = createTestApi(async () => {
            throw new Error("Database unavailable");
        });

        const response = await api.handle(new Request("http://localhost/api/health/ready"));

        expect(response.status).toBe(503);
        expect(await response.json()).toEqual({
            status: "unavailable",
        });
    });
});
