import { describe, expect, it } from "bun:test";
import { createApi } from "./api";

describe("GET /api/hello/:name", () => {
    const api = createApi({
        pingDatabase: async () => {},
    });

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
        const api = createApi({
            pingDatabase: async () => {},
        });

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
        const api = createApi({
            pingDatabase: async () => {},
        });

        const response = await api.handle(new Request("http://localhost/api/health/ready"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            status: "ready",
        });
    });

    it("shows unavailable when database check fails", async () => {
        const api = createApi({
            pingDatabase: async () => {
                throw new Error("Database unavailable");
            },
        });

        const response = await api.handle(new Request("http://localhost/api/health/ready"));

        expect(response.status).toBe(503);
        expect(await response.json()).toEqual({
            status: "unavailable",
        });
    });
});
