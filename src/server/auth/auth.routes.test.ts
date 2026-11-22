import { describe, expect, it } from "bun:test";
import { createAuthRoutes } from "./auth.routes";

const oauthConfiguration = {
    clientId: "test-client",
    redirectUri: "http://localhost:3000/api/auth/42/callback",
};

function createTestAuthRoutes(secureCookies: boolean) {
    return createAuthRoutes({
        oauthConfiguration,
        createState: () => "test-state",
        secureCookies,
    });
}

describe("GET /auth/42", () => {
    it("stores state in a development cookie and redirects to 42", async () => {
        const routes = createTestAuthRoutes(false);

        const response = await routes.handle(new Request("http://localhost/auth/42"));
        const location = new URL(response.headers.get("location") ?? "");
        const cookie = response.headers.get("set-cookie") ?? "";

        expect(response.status).toBe(302);
        expect(location.origin).toBe("https://api.intra.42.fr");
        expect(location.pathname).toBe("/oauth/authorize");
        expect(location.searchParams.get("client_id")).toBe("test-client");
        expect(location.searchParams.get("redirect_uri")).toBe(oauthConfiguration.redirectUri);
        expect(location.searchParams.get("response_type")).toBe("code");
        expect(location.searchParams.get("state")).toBe("test-state");
        expect(cookie).toContain("oauth_state=test-state");
        expect(cookie).toContain("HttpOnly");
        expect(cookie).toContain("SameSite=Lax");
        expect(cookie).toContain("Path=/api/auth/42");
        expect(cookie).toContain("Max-Age=600");
        expect(cookie).not.toContain("Secure");
    });

    it("marks the state cookie as secure in production", async () => {
        const routes = createTestAuthRoutes(true);

        const response = await routes.handle(new Request("https://example.com/auth/42"));
        const cookie = response.headers.get("set-cookie") ?? "";

        expect(response.status).toBe(302);
        expect(cookie).toContain("Secure");
    });
});
