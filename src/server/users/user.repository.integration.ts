import { createDatabaseClient } from "../database/client";
import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { findUserBySchoolId, upsertUser } from "./user.repository";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
    throw new Error("TEST_DATABASE_URL is required for integration tests");
}

const database = createDatabaseClient(testDatabaseUrl);

beforeEach(async () => {
    await database`TRUNCATE TABLE users RESTART IDENTITY`;
});

afterAll(async () => {
    await database.close({ timeout: 5 });
});

describe("user repository", () => {
    test("returns null when the school ID is unknown", async () => {
        const user = await findUserBySchoolId(database, "1001");

        expect(user).toBeNull();
    });

    test("inserts a user and finds it by school ID", async () => {
        const insertedUser = await upsertUser(database, {
            schoolId: "1001",
            login: "ada",
        });

        const foundUser = await findUserBySchoolId(database, "1001");

        expect(foundUser).toEqual(insertedUser);
        expect(insertedUser).toMatchObject({
            id: "1",
            schoolId: "1001",
            login: "ada",
        });
        expect(insertedUser.createdAt).toBeInstanceOf(Date);
        expect(insertedUser.updatedAt).toBeInstanceOf(Date);
    });

    test("updates an existing user without replacing its identity", async () => {
        const insertedUser = await upsertUser(database, {
            schoolId: "1001",
            login: "ada",
        });
        const oldUpdatedAt = new Date("2000-01-01T00:00:00.000Z");

        await database`
            UPDATE users
            SET updated_at = ${oldUpdatedAt}
            WHERE school_id = ${insertedUser.schoolId}
        `;

        const updatedUser = await upsertUser(database, {
            schoolId: "1001",
            login: "ada-updated",
        });
        const [countResult] = await database<{ count: string }[]>`
            SELECT COUNT(*)::TEXT AS count
            FROM users
            WHERE school_id = ${insertedUser.schoolId}
        `;

        expect(updatedUser.id).toBe(insertedUser.id);
        expect(updatedUser.schoolId).toBe(insertedUser.schoolId);
        expect(updatedUser.login).toBe("ada-updated");
        expect(updatedUser.createdAt).toEqual(insertedUser.createdAt);
        expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
        expect(countResult?.count).toBe("1");
    });
});
