// src/routes/student.routes.ts
import { Router } from 'express';
import {
    createStudent,
    deleteStudent,
    getStudentById,
    getStudents,
    updateStudent
} from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Créer un étudiant
 *     tags: [Students]
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
 *               - studentCode
 *             properties:
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur associé
 *               studentCode:
 *                 type: string
 *                 description: Code unique de l'étudiant
 *     responses:
 *       201:
 *         description: Étudiant créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Created
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     studentCode:
 *                       type: string
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticate, createStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Récupérer tous les étudiants
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       studentCode:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *                             nullable: true
 */
router.get('/', authenticate, getStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Récupérer un étudiant par ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'étudiant
 *     responses:
 *       200:
 *         description: Étudiant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       404:
 *         description: Étudiant non trouvé
 */
router.get('/:id', authenticate, getStudentById);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Mettre à jour un étudiant
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'étudiant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Étudiant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Updated
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       404:
 *         description: Étudiant non trouvé
 */
router.put('/:id', authenticate, updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Supprimer un étudiant
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'étudiant
 *     responses:
 *       200:
 *         description: Étudiant supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Deleted
 *                 data:
 *                   type: object
 *                   nullable: true
 */
router.delete('/:id', authenticate, deleteStudent);

export default router;