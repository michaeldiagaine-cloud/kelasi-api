import { Router } from 'express';
import {
    createHomework,
    getHomeworks,
    getMyHomeworks,
    updateHomework,
    deleteHomework,
    getFilteredHomeworks
} from '../controllers/homework.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /homeworks:
 *   post:
 *     summary: Créer un devoir
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Maths - Exercices"
 *             description: "Faire les exercices 1 à 5"
 *             subject: "Mathématiques"
 *             dueDate: "2026-04-20"
 *             attachments: ["https://example.com/file.pdf"]
 *             classId: "uuid-class"
 *             teacherId: "uuid-teacher"
 *             academicYear: "2025-2026"
 *     responses:
 *       201:
 *         description: Devoir créé
 */
router.post('/', createHomework);

/**
 * @swagger
 * /homeworks:
 *   get:
 *     summary: Liste des devoirs
 *     tags: [Homeworks]
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
router.get('/', authenticate, getHomeworks);

/**
 * @swagger
 * /homeworks/me:
 *   get:
 *     summary: Récupérer mes devoirs (élève ou parent)
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des devoirs filtrés
 *       401:
 *         description: Non autorisé
 */
router.get('/me', authenticate, getMyHomeworks);

/**
 * @swagger
 * /homeworks/filter:
 *   get:
 *     summary: Filtrer les devoirs
 *     tags: [Homeworks]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 */
router.get('/filter', authenticate, getFilteredHomeworks);

/**
 * @swagger
 * /homeworks/{id}:
 *   put:
 *     summary: Mettre à jour un devoir
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du devoir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Nouveau titre"
 *             description: "Nouvelle description"
 *     responses:
 *       200:
 *         description: Devoir mis à jour
 *       404:
 *         description: Non trouvé
 */
router.put('/:id', authenticate, updateHomework);

/**
 * @swagger
 * /homeworks/{id}:
 *   delete:
 *     summary: Supprimer un devoir
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du devoir
 *     responses:
 *       200:
 *         description: Supprimé avec succès
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', authenticate, deleteHomework);

export default router;