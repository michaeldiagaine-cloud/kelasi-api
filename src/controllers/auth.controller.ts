// import { generateAccessToken } from '../utils/jwt.js';
// import jwt from 'jsonwebtoken';

import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

import { successResponse, errorResponse } from '../utils/apiResponse.js';
// 🔥 AJOUTS ICI
import * as repo from '../repositories/auth.repository.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../utils/jwt.js';
import { v4 as uuid } from 'uuid';

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 🔐 validation
        if (!email || !password) {
            return errorResponse(res, 'Email et mot de passe requis', 400);
        }

        const data = await authService.login(email, password);

        return successResponse(res, data, 'Login successful');
    } catch (err: any) {
        console.error('LOGIN ERROR:', err); // 🔥 important pour debug

        // erreurs métier
        if (
            err.message === 'User not found' ||
            err.message === 'Invalid password'
        ) {
            return errorResponse(res, err.message, 401);
        }

        // fallback
        return errorResponse(res, err.message || 'Erreur serveur', 500);
    }
};

// ✅ REFRESH TOKEN
export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(res, 'Refresh token requis', 400);
        }

        const stored = await repo.findRefreshToken(refreshToken);

        if (!stored || stored.isRevoked) {
            return errorResponse(res, 'Invalid refresh token', 401);
        }

        const decoded = verifyRefreshToken(refreshToken);

        // 🔥 rotation
        await repo.revokeRefreshToken(refreshToken);

        const payload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            schoolId: decoded.schoolId
        };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        await repo.saveRefreshToken({
            id: uuid(),
            userId: decoded.id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return successResponse(res, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (err: any) {
        console.error(err);
        return errorResponse(res, 'Refresh token invalide', 401);
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(res, 'Refresh token requis', 400);
        }

        await repo.revokeRefreshToken(refreshToken);

        return successResponse(res, null, 'Logged out');
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};