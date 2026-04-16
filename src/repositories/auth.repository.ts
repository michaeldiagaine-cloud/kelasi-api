import { db } from '../config/db.js';

// SAVE
export const saveRefreshToken = async (data: any) => {
    await db.query(
        `INSERT INTO refresh_tokens 
        (id, userId, token, expiresAt, created_at)
        VALUES (?, ?, ?, ?, NOW())`,
        [data.id, data.userId, data.token, data.expiresAt]
    );
};

// FIND
export const findRefreshToken = async (token: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM refresh_tokens WHERE token = ?`,
        [token]
    );
    return rows[0];
};

// REVOKE
export const revokeRefreshToken = async (token: string) => {
    await db.query(
        `UPDATE refresh_tokens SET isRevoked = 1 WHERE token = ?`,
        [token]
    );
};