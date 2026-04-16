import { Router } from 'express';
import {
    createTeacherAssignment,
    deleteTeacherAssignment,
    getTeacherAssignments,
    getByTeacher,
    getByClass
} from '../controllers/teacherAssignment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /teacher-assignments:
 *   post:
 *     summary: Assigner un enseignant à une classe
 *     tags: [TeacherAssignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - classId
 *               - subject
 *               - academicYear
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: "uuid-teacher"
 *               classId:
 *                 type: string
 *                 example: "uuid-class"
 *               subject:
 *                 type: string
 *                 example: "Math"
 *               academicYear:
 *                 type: string
 *                 example: "2025-2026"
 *     responses:
 *       201:
 *         description: Affectation créée
 *       400:
 *         description: Champs invalides
 */
router.post('/', createTeacherAssignment);

/**
 * @swagger
 * /teacher-assignments:
 *   get:
 *     summary: Liste des affectations enseignants
 *     tags: [TeacherAssignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des affectations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getTeacherAssignments);

/**
 * @swagger
 * /teacher-assignments/teacher/{teacherId}:
 *   get:
 *     summary: Récupérer les classes d’un enseignant
 *     description: Retourne toutes les affectations (classes + matières) d’un enseignant
 *     tags: [TeacherAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de l’enseignant
 *         example: "a785411c-c1c5-4fdf-b195-00a1a6653ddc"
 *     responses:
 *       200:
 *         description: Liste des affectations de l’enseignant
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
 *                     properties:
 *                       id:
 *                         type: string
 *                       teacherId:
 *                         type: string
 *                       classId:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       academicYear:
 *                         type: string
 *                       className:
 *                         type: string
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       404:
 *         description: Aucun résultat trouvé
 */
router.get('/teacher/:teacherId', getByTeacher);

/**
 * @swagger
 * /teacher-assignments/class/{classId}:
 *   get:
 *     summary: Récupérer les enseignants d’une classe
 *     tags: [TeacherAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *     responses:
 *       200:
 *         description: Liste des enseignants de la classe
 */
router.get('/class/:classId', authenticate, getByClass);

/**
 * @swagger
 * /teacher-assignments/{id}:
 *   delete:
 *     summary: Supprimer une affectation enseignant
 *     tags: [TeacherAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’affectation
 *     responses:
 *       200:
 *         description: Supprimé avec succès
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', authenticate, deleteTeacherAssignment);

export default router;