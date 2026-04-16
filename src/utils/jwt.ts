import jwt from 'jsonwebtoken';

/**
 * 🔐 Typage du payload JWT
 */
export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    schoolId: string | null;
}

/**
 * 🔐 Chargement des secrets
 */
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error('JWT secrets not defined');
}

/**
 * 🔐 Génération Access Token
 */
export const generateAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: '1h',
        issuer: 'kelasi-api',
        audience: 'kelasi-client'
    });
};

/**
 * 🔐 Génération Refresh Token
 */
export const generateRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '7d',
        issuer: 'kelasi-api',
        audience: 'kelasi-client'
    });
};

/**
 * 🔍 Vérification Access Token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, ACCESS_SECRET, {
        issuer: 'kelasi-api',
        audience: 'kelasi-client'
    });

    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload');
    }

    return decoded as JwtPayload;
};

/**
 * 🔍 Vérification Refresh Token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, REFRESH_SECRET, {
        issuer: 'kelasi-api',
        audience: 'kelasi-client'
    });

    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload');
    }

    return decoded as JwtPayload;
};