import { db } from '../config/db.js';
import type { RowDataPacket } from 'mysql2';
import type { UpdateUserDto } from '../dtos/user.dto.js';

export const insertUser = async (user: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: string;
    schoolId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}) => {
    const {
        id,
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        schoolId,
        createdAt,
        updatedAt
    } = user;

    await db.query(
        `INSERT INTO users 
        (id, email, password_hash, firstName, lastName, role, schoolId, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            email,
            passwordHash,
            firstName,
            lastName,
            role,
            schoolId || null,
            createdAt,
            updatedAt
        ]
    );

    return { id, email, firstName, lastName, role, schoolId: schoolId || null };
};

export const findAllUsers = async () => {
    const [rows] = await db.query(
        `SELECT 
            id,
            email,
            firstName,
            lastName,
            role,
            schoolId
         FROM users`
    );
    return rows;
};

export const findUserById = async (id: string) => {
    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT 
            id,
            email,
            firstName,
            lastName,
            role,
            schoolId
         FROM users WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
};

export const updateUserById = async (id: string, data: UpdateUserDto) => {
    const mapping: any = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        role: 'role',
        schoolId: 'schoolId'
    };

    const keys = Object.keys(data).filter((k) => mapping[k]);

    if (keys.length === 0) return findUserById(id);

    const fields = keys.map((k) => `${mapping[k]} = ?`).join(', ');
    const values = keys.map((k) => (data as any)[k]);

    await db.query(
        `UPDATE users SET ${fields}, updated_at = ? WHERE id = ?`,
        [...values, new Date(), id]
    );

    return findUserById(id);
};

export const findUsersBySchool = async (schoolId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            u.id,
            u.email,
            u.firstName,
            u.lastName,
            u.role,
            u.schoolId,
            s.name AS schoolName,
            s.code AS schoolCode
         FROM users u
         LEFT JOIN schools s ON u.schoolId = s.id
         WHERE u.schoolId = ?`,
        [schoolId]
    );

    return rows;
};

export const deleteUserById = async (id: string) => {
    const [result]: any = await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    return result.affectedRows > 0;
};