import type { FortyTwoOAuthConfiguration } from "../config/environment";

const FORTY_TWO_AUTHORIZATION_ENDPOINT = "https://api.intra.42.fr/oauth/authorize";

export function createFortyTwoAuthorizationUrl(
    configuration: FortyTwoOAuthConfiguration,
    state: string,
): URL {
    if (!state.trim()) {
        throw new Error("OAuth state is required");
    }

    const url = new URL(FORTY_TWO_AUTHORIZATION_ENDPOINT);

    url.searchParams.set("client_id", configuration.clientId);
    url.searchParams.set("redirect_uri", configuration.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", state);

    return url;
}
