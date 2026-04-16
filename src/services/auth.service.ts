import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
    generateAccessToken,
    generateRefreshToken
} from '../utils/jwt.js';
import * as repo from '../repositories/auth.repository.js';

export const login = async (email: string, password: string) => {
    const [rows]: any = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    const user = rows[0];

    if (!user) {
        throw new Error('User not found');
    }

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
        schoolId: user.schoolId
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 🔥 AJOUT SANS CASSER TON CODE
    await repo.saveRefreshToken({
        id: uuid(),
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    };
};