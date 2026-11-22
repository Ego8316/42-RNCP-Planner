import type { DatabaseClient } from "../database/client";

export type User = {
    id: string;
    schoolId: string;
    login: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UpsertUserInput = {
    schoolId: string;
    login: string;
};

export async function findUserBySchoolId(
    database: DatabaseClient,
    schoolId: string,
): Promise<User | null> {
    const [user] = await database<User[]>`
        SELECT
            id::TEXT AS id,
            school_id::TEXT AS "schoolId",
            login,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        FROM users
        WHERE school_id = ${schoolId}
        LIMIT 1;
    `;

    return user ?? null;
}

export async function upsertUser(database: DatabaseClient, input: UpsertUserInput): Promise<User> {
    const [user] = await database<User[]>`
        INSERT INTO users (school_id, login)
        VALUES (${input.schoolId}, ${input.login})
        ON CONFLICT (school_id)
        DO UPDATE SET
            login = EXCLUDED.login,
            updated_at = CURRENT_TIMESTAMP
        RETURNING 
            id::TEXT AS id,
            school_id::TEXT AS "schoolId",
            login,
            created_at AS "createdAt",
            updated_at AS "updatedAt";
    `;

    if (!user) {
        throw new Error("Upserting a user returned no row");
    }

    return user;
}
