import { Router } from 'express';
import { login, logout, refresh } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getSchoolByIdRepo } from '../repositories/school.repository.js';
import { successResponse } from '../utils/apiResponse.js';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login d’un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "user@email.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login réussi
 *       401:
 *         description: Credentials invalides
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur connecté
 *       401:
 *         description: Non authentifié
 */
router.get('/me', authenticate, async (req, res) => {
    const user = req.user;

    let school = null;

    if (user?.schoolId) {
        school = await getSchoolByIdRepo(user.schoolId);
    }

    return successResponse(res, {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        school
    });
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d’accès
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             refreshToken: "your_refresh_token"
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *       401:
 *         description: Refresh token invalide
 */
router.post('/refresh', authenticate, refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             refreshToken: "your_refresh_token"
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', authenticate, logout);

export default router;