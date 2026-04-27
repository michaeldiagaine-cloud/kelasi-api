// src/repositories/class.repository.ts

import { db } from '../config/db.js';
import type {
    CreateClassDto,
    UpdateClassDto
} from '../dtos/class.dto.js';

// CREATE
export const createClass = async (
    data: CreateClassDto & { id: string }
) => {
    const result: any = await db.query(
        `
        INSERT INTO classes (
            id,
            name,
            level,
            "schoolId",
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        `,
        [
            data.id,
            data.name,
            data.level,
            data.schoolId
        ]
    );

    return result;
};

// GET ALL
export const findClasses = async () => {
    const result: any = await db.query(
        `
        SELECT
            c.*,
            s.name AS "schoolName",
            s.code AS "schoolCode"
        FROM classes c
        LEFT JOIN schools s
            ON c."schoolId" = s.id
        ORDER BY c.created_at DESC
        `
    );

    return result.rows;
};

// GET BY ID
export const findClassById = async (id: string) => {
    const result: any = await db.query(
        `
        SELECT
            c.*,
            s.name AS "schoolName",
            s.code AS "schoolCode"
        FROM classes c
        LEFT JOIN schools s
            ON c."schoolId" = s.id
        WHERE c.id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

// GET BY SCHOOL
export const findClassesBySchool = async (schoolId: string) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM classes
        WHERE "schoolId" = $1
        ORDER BY created_at DESC
        `,
        [schoolId]
    );

    return result.rows;
};

// UPDATE
export const updateClass = async (
    id: string,
    data: UpdateClassDto
) => {
    await db.query(
        `
        UPDATE classes
        SET
            name = COALESCE($1, name),
            level = COALESCE($2, level),
            "schoolId" = COALESCE($3, "schoolId"),
            updated_at = NOW()
        WHERE id = $4
        `,
        [
            data.name ?? null,
            data.level ?? null,
            data.schoolId ?? null,
            id
        ]
    );

    return await findClassById(id);
};

// DELETE
export const deleteClass = async (id: string) => {
    const result: any = await db.query(
        `
        DELETE FROM classes
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};