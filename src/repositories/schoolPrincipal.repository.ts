// src/repositories/schoolPrincipal.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createPrincipal = async (data: {
    userId: string;
    schoolId: string;
    startDate: string;
    isActive: boolean;
}) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO school_principals (
            id,
            "userId",
            "schoolId",
            "startDate",
            "isActive",
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `,
        [
            id,
            data.userId,
            data.schoolId,
            data.startDate,
            data.isActive
        ]
    );

    return {
        id,
        ...data
    };
};

// GET ALL (ENRICHI)
export const findPrincipals = async () => {
    const result: any = await db.query(
        `
        SELECT
            sp.*,
            CONCAT(u."firstName", ' ', u."lastName") AS "principalName",
            s.name AS "schoolName"
        FROM school_principals sp
        JOIN users u
            ON sp."userId" = u.id
        JOIN schools s
            ON sp."schoolId" = s.id
        ORDER BY sp.created_at DESC
        `
    );

    return result.rows;
};

// GET BY SCHOOL
export const findBySchool = async (schoolId: string) => {
    const result: any = await db.query(
        `
        SELECT
            sp.*,
            CONCAT(u."firstName", ' ', u."lastName") AS "principalName"
        FROM school_principals sp
        JOIN users u
            ON sp."userId" = u.id
        WHERE sp."schoolId" = $1
        ORDER BY sp.created_at DESC
        `,
        [schoolId]
    );

    return result.rows;
};

// UPDATE
export const updatePrincipal = async (
    id: string,
    data: any
) => {
    await db.query(
        `
        UPDATE school_principals
        SET
            "isActive" = COALESCE($1, "isActive"),
            "endDate" = COALESCE($2, "endDate"),
            updated_at = NOW()
        WHERE id = $3
        `,
        [
            data.isActive ?? null,
            data.endDate ?? null,
            id
        ]
    );

    return await findPrincipals();
};

// DELETE
export const deletePrincipal = async (id: string) => {
    const result: any = await db.query(
        `
        DELETE FROM school_principals
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};