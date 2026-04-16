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
    const now = new Date();

    await db.query(
        `INSERT INTO school_principals
        (id, userId, schoolId, startDate, isActive, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, data.userId, data.schoolId, data.startDate, data.isActive, now, now]
    );

    return { id, ...data };
};

// GET ALL (ENRICHI)
export const findPrincipals = async () => {
    const [rows]: any = await db.query(
        `SELECT 
            sp.*,
            CONCAT(u.firstName, ' ', u.lastName) AS principalName,
            s.name AS schoolName

         FROM school_principals sp
         JOIN users u ON sp.userId = u.id
         JOIN schools s ON sp.schoolId = s.id`
    );

    return rows;
};

// GET BY SCHOOL
export const findBySchool = async (schoolId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            sp.*,
            CONCAT(u.firstName, ' ', u.lastName) AS principalName

         FROM school_principals sp
         JOIN users u ON sp.userId = u.id
         WHERE sp.schoolId = ?`,
        [schoolId]
    );

    return rows;
};

// UPDATE
export const updatePrincipal = async (id: string, data: any) => {
    const now = new Date();

    await db.query(
        `UPDATE school_principals 
         SET isActive = COALESCE(?, isActive),
             endDate = COALESCE(?, endDate),
             updated_at = ?
         WHERE id = ?`,
        [data.isActive, data.endDate, now, id]
    );

    return findPrincipals();
};

// DELETE
export const deletePrincipal = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM school_principals WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};