import { Elysia, t } from "elysia";
import type { FortyTwoOAuthConfiguration } from "../config/environment";
import { createFortyTwoAuthorizationUrl } from "./authorization";

const OAUTH_STATE_COOKIE_MAX_AGE_SEC = 10 * 60;

export type AuthRouteDependencies = {
    oauthConfiguration: FortyTwoOAuthConfiguration;
    createState: () => string;
    secureCookies: boolean;
};

export function createAuthRoutes(dependencies: AuthRouteDependencies) {
    return new Elysia({ prefix: "/auth/42" }).get(
        "/",
        ({ cookie: { oauth_state: oauthState }, redirect }) => {
            const state = dependencies.createState();
            oauthState.set({
                value: state,
                httpOnly: true,
                sameSite: "lax",
                secure: dependencies.secureCookies,
                path: "/api/auth/42",
                maxAge: OAUTH_STATE_COOKIE_MAX_AGE_SEC,
            });

            const url = createFortyTwoAuthorizationUrl(dependencies.oauthConfiguration, state);

            return redirect(url.toString(), 302);
        },
        {
            cookie: t.Cookie({
                oauth_state: t.Optional(t.String()),
            }),
        },
    );
}
