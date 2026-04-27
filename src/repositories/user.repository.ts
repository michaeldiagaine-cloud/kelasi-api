// src/repositories/user.repository.ts

import { db } from '../config/db.js';
import type { UpdateUserDto } from '../dtos/user.dto.js';

// CREATE
export const insertUser = async (user: {
    id: string;
    email: string;
    passwordHash: string;
    firstname: string;
    lastname: string;
    role: string;
    schoolId?: string | null;
}) => {
    const {
        id,
        email,
        passwordHash,
        firstname,
        lastname,
        role,
        schoolId
    } = user;

    await db.query(
        `
        INSERT INTO users (
            id,
            email,
            password_hash,
            firstname,
            lastname,
            role,
            schoolId,
            created_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, NOW(), NOW()
        )
        `,
        [
            id,
            email,
            passwordHash,
            firstname,
            lastname,
            role,
            schoolId || null
        ]
    );

    return {
        id,
        email,
        firstname,
        lastname,
        role,
        schoolId: schoolId || null
    };
};

// GET ALL
export const findAllUsers = async () => {
    const result: any = await db.query(
        `
        SELECT
            u.id,
            u.email,
            u.firstname,
            u.lastname,
            u.role,
            u.schoolId,
            s.name AS "schoolName",
            s.code AS "schoolCode"

        FROM users u

        LEFT JOIN schools s
            ON u.schoolId = s.id

        ORDER BY u.created_at DESC
        `
    );

    return result.rows;
};

// GET BY ID
export const findUserById = async (
    id: string
) => {
    const result: any = await db.query(
        `
        SELECT
            u.id,
            u.email,
            u.firstname,
            u.lastname,
            u.role,
            u.schoolId,
            s.name AS "schoolName",
            s.code AS "schoolCode"

        FROM users u

        LEFT JOIN schools s
            ON u.schoolId = s.id

        WHERE u.id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

// UPDATE
export const updateUserById = async (
    id: string,
    data: UpdateUserDto
) => {
    const mapping: any = {
        email: 'email',
        firstname: 'firstname',
        lastname: 'lastname',
        role: 'role',
        schoolId: 'schoolId'
    };

    const keys = Object.keys(data).filter(
        (k) => mapping[k]
    );

    if (keys.length === 0) {
        return await findUserById(id);
    }

    const values: any[] = [];
    let index = 1;

    const fields = keys.map((key) => {
        const field = `${mapping[key]} = $${index}`;
        values.push((data as any)[key]);
        index++;
        return field;
    });

    values.push(id);

    await db.query(
        `
        UPDATE users
        SET
            ${fields.join(', ')},
            updated_at = NOW()
        WHERE id = $${index}
        `,
        values
    );

    return await findUserById(id);
};

// GET BY SCHOOL
export const findUsersBySchool = async (
    schoolId: string
) => {
    const result: any = await db.query(
        `
        SELECT
            u.id,
            u.email,
            u.firstname,
            u.lastname,
            u.role,
            u.schoolId,

            s.name AS "schoolName",
            s.code AS "schoolCode"

        FROM users u

        LEFT JOIN schools s
            ON u.schoolId = s.id

        WHERE u.schoolId = $1

        ORDER BY u.created_at DESC
        `,
        [schoolId]
    );

    return result.rows;
};

// DELETE
export const deleteUserById = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM users
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};