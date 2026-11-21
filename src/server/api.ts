import { Elysia, t } from "elysia";

export type ApiDependencies = {
    pingDatabase: () => Promise<void>;
};

export function createApi(dependencies: ApiDependencies) {
    return new Elysia({ prefix: "/api" })
        .get(
            "/hello/:name",
            ({ params }) => {
                return { message: `Hello, ${params.name}` };
            },
            {
                params: t.Object({
                    name: t.String(),
                }),
                response: {
                    200: t.Object({
                        message: t.String(),
                    }),
                },
            },
        )
        .get(
            "/hello",
            () => {
                return { message: "Hello, world!", method: "GET" };
            },
            {
                response: {
                    200: t.Object({
                        message: t.String(),
                        method: t.String(),
                    }),
                },
            },
        )
        .put(
            "/hello",
            () => {
                return { message: "Hello, world!", method: "PUT" };
            },
            {
                response: {
                    200: t.Object({
                        message: t.String(),
                        method: t.String(),
                    }),
                },
            },
        )
        .get(
            "/health/ready",
            async ({ status }) => {
                try {
                    await dependencies.pingDatabase();

                    return { status: "ready" } as const;
                } catch {
                    return status(503, {
                        status: "unavailable",
                    } as const);
                }
            },
            {
                response: {
                    200: t.Object({
                        status: t.Literal("ready"),
                    }),
                    503: t.Object({
                        status: t.Literal("unavailable"),
                    }),
                },
            },
        );
}

export type Api = ReturnType<typeof createApi>;
