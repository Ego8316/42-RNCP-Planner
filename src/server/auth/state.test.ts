import { describe, expect, it } from "bun:test";
import { createOAuthState } from "./state";

describe("OAuth state", () => {
    it("creates non-empty base64url values", () => {
        const state = createOAuthState();

        expect(state).not.toBeEmpty();
        expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("creates a different value for each authorization attempt", () => {
        expect(createOAuthState()).not.toBe(createOAuthState());
    });
});
