import { Router } from 'express';
import {
    createReport,
    getReports,
    deleteReport
} from '../controllers/discipline.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /discipline:
 *   post:
 *     summary: Créer un rapport disciplinaire
 *     description: Seul un utilisateur avec le rôle DIRECTION peut créer un rapport disciplinaire
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Bagarre"
 *             description: "Conflit entre élèves dans la cour"
 *             level: "SUSPENSION"
 *             actionTaken: "3 jours de suspension"
 *             date: "2026-04-10"
 *             studentId: "uuid-student"
 *             academicYear: "2025-2026"
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle incorrect)
 */
router.post('/', authenticate, createReport);

/**
 * @swagger
 * /discipline:
 *   get:
 *     summary: Liste filtrée des rapports disciplinaires
 *     description: Permet de filtrer les rapports par école, classe, élève, niveau, date et année scolaire
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: ID de l’école
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: ID de la classe
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: ID de l’élève
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [WARNING, OBSERVATION, SUSPENSION, EXCLUSION]
 *         description: Niveau de discipline
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *         example: "2025-2026"
 *         description: Année scolaire
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-04-10"
 *         description: Date de l’incident
 *     responses:
 *       200:
 *         description: Liste des rapports récupérée
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticate, getReports);

/**
 * @swagger
 * /discipline/{id}:
 *   delete:
 *     summary: Supprimer un rapport disciplinaire
 *     description: Supprime un rapport disciplinaire par son ID
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport disciplinaire
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticate, deleteReport);

export default router;