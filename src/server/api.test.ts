import { describe, expect, it } from "bun:test";
import { api } from "./api";

describe("GET /api/hello/:name", () => {
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
        const response = await api.handle(new Request("http://localhost/api/hello"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            message: "Hello, world!",
            method: "GET",
        });
    });
});
