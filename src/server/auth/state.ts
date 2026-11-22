export function createOAuthState(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));

    return Buffer.from(bytes).toString("base64url");
}
