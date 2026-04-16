import { Router } from 'express';
import {
    createPrincipal,
    deletePrincipal,
    getPrincipals,
    getBySchool,
    updatePrincipal
} from '../controllers/schoolPrincipal.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /school-principals:
 *   post:
 *     summary: Nommer un directeur
 *     description: Assigne un utilisateur comme directeur d’une école
 *     tags: [SchoolPrincipals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - schoolId
 *               - startDate
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "uuid-user"
 *               schoolId:
 *                 type: string
 *                 example: "uuid-school"
 *               startDate:
 *                 type: string
 *                 example: "2026-01-01"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Directeur nommé avec succès
 *       400:
 *         description: Champs invalides ou directeur déjà existant
 */
router.post('/', authenticate, createPrincipal);

/**
 * @swagger
 * /school-principals:
 *   get:
 *     summary: Liste des directeurs
 *     description: Retourne toutes les affectations de direction (actuelles et historiques)
 *     tags: [SchoolPrincipals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des directeurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', authenticate, getPrincipals);

/**
 * @swagger
 * /school-principals/school/{schoolId}:
 *   get:
 *     summary: Récupérer le directeur d’une école
 *     description: Retourne le directeur (actuel ou historique) d’une école
 *     tags: [SchoolPrincipals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’école
 *         example: "uuid-school"
 *     responses:
 *       200:
 *         description: Directeur(s) trouvé(s)
 *       404:
 *         description: Aucun directeur trouvé
 */
router.get('/school/:schoolId', authenticate, getBySchool);

/**
 * @swagger
 * /school-principals/{id}:
 *   put:
 *     summary: Mettre à jour un directeur
 *     description: Permet de désactiver un directeur ou définir une date de fin
 *     tags: [SchoolPrincipals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’affectation
 *         example: "uuid-assignment"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *               endDate:
 *                 type: string
 *                 example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 *       404:
 *         description: Non trouvé
 */
router.put('/:id', authenticate, updatePrincipal);

/**
 * @swagger
 * /school-principals/{id}:
 *   delete:
 *     summary: Supprimer un directeur
 *     description: Supprime une affectation de direction
 *     tags: [SchoolPrincipals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’affectation
 *         example: "uuid-assignment"
 *     responses:
 *       200:
 *         description: Supprimé avec succès
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', authenticate, deletePrincipal);

export default router;