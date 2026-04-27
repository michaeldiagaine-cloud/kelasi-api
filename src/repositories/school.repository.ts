// src/repositories/school.repository.ts

import { db } from '../config/db.js';

export const createSchoolRepo = async (data: {
    id: string;
    name: string;
    code: string;
}) => {
    await db.query(
        `
        INSERT INTO schools (id, name, code, status)
        VALUES ($1, $2, $3, $4)
        `,
        [
            data.id,
            data.name,
            data.code,
            'ACTIVE'
        ]
    );

    return data;
};

export const getSchoolsRepo = async () => {
    const result: any = await db.query(`
        SELECT *
        FROM schools
        ORDER BY created_at DESC
    `);

    return result.rows;
};

export const getSchoolByIdRepo = async (id: string) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM schools
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const updateSchoolRepo = async (
    id: string,
    data: {
        name?: string;
        code?: string;
    }
) => {
    const result: any = await db.query(
        `
        UPDATE schools
        SET
            name = COALESCE($1, name),
            code = COALESCE($2, code),
            updated_at = NOW()
        WHERE id = $3
        `,
        [
            data.name ?? null,
            data.code ?? null,
            id
        ]
    );

    return result.rowCount > 0;
};

export const deleteSchoolRepo = async (id: string) => {
    const result: any = await db.query(
        `
        DELETE FROM schools
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};