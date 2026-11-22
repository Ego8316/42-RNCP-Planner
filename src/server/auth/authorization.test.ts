import { describe, expect, it } from "bun:test";
import { createFortyTwoAuthorizationUrl } from "./authorization";

describe("42 Authorization", () => {
    const configuration = {
        clientId: "test-client",
        redirectUri: "http://localhost:3000/api/auth/42/callback",
    };

    it("creates a 42 authorization URL with the required parameters", () => {
        const url = createFortyTwoAuthorizationUrl(configuration, "test-state");

        expect(url.origin).toBe("https://api.intra.42.fr");
        expect(url.pathname).toBe("/oauth/authorize");
        expect(url.searchParams.get("client_id")).toBe("test-client");
        expect(url.searchParams.get("redirect_uri")).toBe(
            "http://localhost:3000/api/auth/42/callback",
        );
        expect(url.searchParams.get("response_type")).toBe("code");
        expect(url.searchParams.get("state")).toBe("test-state");
    });

    it("throws when state is empty or whitespace", () => {
        expect(() => createFortyTwoAuthorizationUrl(configuration, "")).toThrow(
            "OAuth state is required",
        );
        expect(() => createFortyTwoAuthorizationUrl(configuration, "   ")).toThrow(
            "OAuth state is required",
        );
    });
});
