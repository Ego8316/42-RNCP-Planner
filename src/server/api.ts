import { Elysia, t } from "elysia";

export const api = new Elysia({ prefix: "/api" })
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
    );

export type Api = typeof api;
