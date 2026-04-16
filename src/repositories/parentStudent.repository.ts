import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createParentStudent = async (data: {
    parentId: string;
    studentId: string;
}) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO parent_students 
        (id, parentId, studentId, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)`,
        [id, data.parentId, data.studentId, now, now]
    );

    return { id, ...data };
};

// GET ALL (ENRICHI)
export const findParentStudents = async () => {
    const [rows]: any = await db.query(
        `SELECT 
            ps.id,
            ps.parentId,
            ps.studentId,

            -- Parent
            CONCAT(p.firstName, ' ', p.lastName) AS parentName,

            -- Student
            s.studentCode,
            CONCAT(u.firstName, ' ', u.lastName) AS studentName

         FROM parent_students ps
         JOIN users p ON ps.parentId = p.id
         JOIN students s ON ps.studentId = s.id
         JOIN users u ON s.userId = u.id`
    );

    return rows;
};

// GET BY PARENT
export const findByParent = async (parentId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            ps.*,
            CONCAT(u.firstName, ' ', u.lastName) AS studentName

         FROM parent_students ps
         JOIN students s ON ps.studentId = s.id
         JOIN users u ON s.userId = u.id
         WHERE ps.parentId = ?`,
        [parentId]
    );

    return rows;
};

// GET BY STUDENT
export const findByStudent = async (studentId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            ps.*,
            CONCAT(p.firstName, ' ', p.lastName) AS parentName

         FROM parent_students ps
         JOIN users p ON ps.parentId = p.id
         WHERE ps.studentId = ?`,
        [studentId]
    );

    return rows;
};

// DELETE
export const deleteParentStudent = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM parent_students WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};