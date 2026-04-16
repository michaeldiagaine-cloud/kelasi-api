import { db } from '../config/db.js';
import type { CreateClassDto, UpdateClassDto } from '../dtos/class.dto.js';

export const createClass = async (data: CreateClassDto & { id: string }) => {
    const now = new Date();

    const [result]: any = await db.query(
        `INSERT INTO classes (id, name, level, schoolId, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.id, data.name, data.level, data.schoolId, now, now]
    );

    return result;
};

export const findClasses = async () => {
    const [rows]: any = await db.query(
        `SELECT c.*, s.name as schoolName, s.code as schoolCode
         FROM classes c
         LEFT JOIN schools s ON c.schoolId = s.id`
    );
    return rows;
};

export const findClassById = async (id: string) => {
    const [rows]: any = await db.query(
        `SELECT c.*, s.name as schoolName, s.code as schoolCode
         FROM classes c
         LEFT JOIN schools s ON c.schoolId = s.id
         WHERE c.id = ?`,
        [id]
    );
    return rows[0] || null;
};

export const findClassesBySchool = async (schoolId: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM classes WHERE schoolId = ?`,
        [schoolId]
    );
    return rows;
};

export const updateClass = async (id: string, data: UpdateClassDto) => {
    const now = new Date();

    await db.query(
        `UPDATE classes 
         SET name = ?, level = ?, schoolId = ?, updated_at = ?
         WHERE id = ?`,
        [data.name, data.level, data.schoolId, now, id]
    );

    return findClassById(id);
};

export const deleteClass = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM classes WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
};