import { Router } from 'express';
import {
    createJustification,
    getByAttendance,
    reviewJustification,
    deleteJustification
} from '../controllers/justification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /justifications:
 *   post:
 *     summary: Créer une justification
 *     description: Permet de créer une justification pour une absence ou un retard (ABSENT ou LATE uniquement)
 *     tags: [Justifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendanceId
 *               - reason
 *             properties:
 *               attendanceId:
 *                 type: string
 *                 example: "uuid-attendance"
 *               reason:
 *                 type: string
 *                 example: "Maladie"
 *               documentUrl:
 *                 type: string
 *                 example: "https://example.com/document.pdf"
 *     responses:
 *       201:
 *         description: Justification créée avec succès
 *       400:
 *         description: Données invalides ou justification non autorisée
 */
router.post('/', authenticate, createJustification);

/**
 * @swagger
 * /justifications/attendance/{attendanceId}:
 *   get:
 *     summary: Récupérer une justification par attendance
 *     description: Retourne la justification associée à une présence donnée
 *     tags: [Justifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'attendance
 *         example: "uuid-attendance"
 *     responses:
 *       200:
 *         description: Justification trouvée
 *       404:
 *         description: Aucune justification trouvée
 */
router.get('/attendance/:attendanceId', authenticate, getByAttendance);

/**
 * @swagger
 * /justifications/{id}/review:
 *   put:
 *     summary: Approuver ou rejeter une justification
 *     description: Permet à un administrateur ou directeur de valider ou rejeter une justification
 *     tags: [Justifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la justification
 *         example: "uuid-justification"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - reviewedBy
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 example: "APPROVED"
 *               reviewedBy:
 *                 type: string
 *                 example: "uuid-user"
 *     responses:
 *       200:
 *         description: Justification mise à jour
 *       404:
 *         description: Justification non trouvée
 */
router.put('/:id/review', authenticate, reviewJustification);

/**
 * @swagger
 * /justifications/{id}:
 *   delete:
 *     summary: Supprimer une justification
 *     description: Supprime une justification existante
 *     tags: [Justifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la justification
 *         example: "uuid-justification"
 *     responses:
 *       200:
 *         description: Supprimée avec succès
 *       404:
 *         description: Non trouvée
 */
router.delete('/:id', authenticate, deleteJustification);

export default router;