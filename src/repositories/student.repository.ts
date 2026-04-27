// src/repositories/student.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createStudent = async (data: {
    userId: string;
    studentCode: string;
}) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO students (
            id,
            "userId",
            "studentCode",
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, NOW(), NOW())
        `,
        [
            id,
            data.userId,
            data.studentCode
        ]
    );

    return {
        id,
        ...data
    };
};

// GET ALL
export const findStudents = async () => {
    const result: any = await db.query(
        `
        SELECT 
            s.id,
            s."studentCode",
            s."userId",
            u."firstName",
            u."lastName",
            u."avatarUrl"
        FROM students s
        JOIN users u
            ON s."userId" = u.id
        ORDER BY s.created_at DESC
        `
    );

    return result.rows;
};

// GET BY ID
export const findStudentById = async (id: string) => {
    const result: any = await db.query(
        `
        SELECT 
            s.id,
            s."studentCode",
            s."userId",
            u."firstName",
            u."lastName",
            u."avatarUrl"
        FROM students s
        JOIN users u
            ON s."userId" = u.id
        WHERE s.id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

// UPDATE
export const updateStudent = async (
    id: string,
    data: Partial<{
        studentCode: string;
    }>
) => {
    await db.query(
        `
        UPDATE students
        SET
            "studentCode" = COALESCE($1, "studentCode"),
            updated_at = NOW()
        WHERE id = $2
        `,
        [
            data.studentCode ?? null,
            id
        ]
    );

    return await findStudentById(id);
};

// DELETE
export const deleteStudent = async (id: string) => {
    const result: any = await db.query(
        `
        DELETE FROM students
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};