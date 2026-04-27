import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
    generateAccessToken,
    generateRefreshToken
} from '../utils/jwt.js';
import * as repo from '../repositories/auth.repository.js';

export const login = async (email: string, password: string) => {
    // ✅ PostgreSQL utilise $1 et result.rows
    const result: any = await db.query(
        `SELECT * 
         FROM users 
         WHERE email = $1`,
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    // ✅ PostgreSQL retourne souvent les colonnes en snake_case
    const hash = user.password_hash;

    if (!hash) {
        throw new Error('Password hash not found');
    }

    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
        throw new Error('Invalid password');
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.school_id // ⚠️ PostgreSQL souvent snake_case
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 🔥 sauvegarde refresh token
    await repo.saveRefreshToken({
        id: uuid(),
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name, // ⚠️ snake_case
            lastName: user.last_name,   // ⚠️ snake_case
            role: user.role
        }
    };
};