import { db } from '../config/db.js';

export const createSchoolRepo = async (data: {
    id: string;
    name: string;
    code: string;
}) => {
    await db.query(
        'INSERT INTO schools (id, name, code, status) VALUES (?, ?, ?, ?)',
        [data.id, data.name, data.code, 'ACTIVE']
    );

    return data;
};

export const getSchoolsRepo = async () => {
    const [rows]: any = await db.query('SELECT * FROM schools');
    return rows;
};

export const getSchoolByIdRepo = async (id: string) => {
    const [rows]: any = await db.query(
        'SELECT * FROM schools WHERE id = ?',
        [id]
    );

    return rows[0] || null;
};

export const updateSchoolRepo = async (
    id: string,
    data: { name?: string; code?: string }
) => {
    const [result]: any = await db.query(
        'UPDATE schools SET name = ?, code = ? WHERE id = ?',
        [data.name, data.code, id]
    );

    return result.affectedRows > 0;
};

export const deleteSchoolRepo = async (id: string) => {
    const [result]: any = await db.query(
        'DELETE FROM schools WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
};