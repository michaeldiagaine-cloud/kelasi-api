import type { OkPacket, RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

export const createStudent = async (data: {
    userId: string;
    studentCode: string;
}) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO students (id, userId, studentCode, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, data.userId, data.studentCode, now, now]
    );

    return { id, ...data };
};

export const findStudents = async () => {
    const [rows] = await db.query(
        `SELECT 
            s.id,
            s.studentCode,
            s.userId,
            u.firstName,
            u.lastName,
            u.avatarUrl
         FROM students s
         JOIN users u ON s.userId = u.id`
    );

    return rows;
};

export const findStudentById = async (id: string) => {
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT 
            s.id,
            s.studentCode,
            s.userId,
            u.firstName,
            u.lastName,
            u.avatarUrl
         FROM students s
         JOIN users u ON s.userId = u.id
         WHERE s.id = ?`,
        [id]
    );

    return rows[0] || null;
};

export const updateStudent = async (
    id: string,
    data: Partial<{ studentCode: string }>
) => {
    const now = new Date();

    await db.query(
        `UPDATE students 
         SET studentCode = COALESCE(?, studentCode),
             updated_at = ?
         WHERE id = ?`,
        [data.studentCode, now, id]
    );

    return findStudentById(id);
};

export const deleteStudent = async (id: string) => {
    const [result] = await db.query<OkPacket>(
        `DELETE FROM students WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};