import { Router } from 'express';
import {
    createParentStudent,
    deleteParentStudent,
    getParentStudents,
    getByParent,
    getByStudent
} from '../controllers/parentStudent.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /parent-students:
 *   post:
 *     summary: Lier un parent à un étudiant
 *     tags: [ParentStudents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentId
 *               - studentId
 *             properties:
 *               parentId:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lien créé
 */
router.post('/', authenticate, createParentStudent);

/**
 * @swagger
 * /parent-students:
 *   get:
 *     summary: Liste des relations parent-étudiant
 *     tags: [ParentStudents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste
 */
router.get('/', authenticate, getParentStudents);

/**
 * @swagger
 * /parent-students/parent/{parentId}:
 *   get:
 *     summary: Récupérer les enfants d’un parent
 *     description: Retourne la liste des étudiants liés à un parent
 *     tags: [ParentStudents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID du parent
 *         example: "a785411c-c1c5-4fdf-b195-00a1a6653ddc"
 *     responses:
 *       200:
 *         description: Liste des enfants du parent
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
 *                       parentId:
 *                         type: string
 *                       studentId:
 *                         type: string
 *                       studentName:
 *                         type: string
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun enfant trouvé
 */
router.get('/parent/:parentId', authenticate, getByParent);

/**
 * @swagger
 * /parent-students/student/{studentId}:
 *   get:
 *     summary: Récupérer les parents d’un étudiant
 *     description: Retourne la liste des parents liés à un étudiant
 *     tags: [ParentStudents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de l’étudiant
 *         example: "4e0d119d-cb67-4ee2-81b3-e1e6feefde62"
 *     responses:
 *       200:
 *         description: Liste des parents de l’étudiant
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
 *                       parentId:
 *                         type: string
 *                       studentId:
 *                         type: string
 *                       parentName:
 *                         type: string
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun parent trouvé
 */
router.get('/student/:studentId', authenticate, getByStudent);
/**
 * @swagger
 * /parent-students/{id}:
 *   delete:
 *     summary: Supprimer un lien parent-étudiant
 *     tags: [ParentStudents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', authenticate, deleteParentStudent);

export default router;