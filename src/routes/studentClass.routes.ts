import { Router } from 'express';
import {
    createStudentClass,
    deleteStudentClass,
    getStudentClassById,
    getStudentClasses,
    getByStudent,
    updateStudentClass,
    getBySchool,
    getByClass
} from '../controllers/studentClass.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /student-classes:
 *   post:
 *     summary: Créer une affectation étudiant → classe
 *     tags: [StudentClasses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - classId
 *               - academicYear
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *               academicYear:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/', authenticate, createStudentClass);

/**
 * @swagger
 * /student-classes:
 *   get:
 *     summary: Récupérer toutes les affectations
 *     tags: [StudentClasses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des affectations
 */
router.get('/', authenticate, getStudentClasses);

/**
 * @swagger
 * /student-classes/{id}:
 *   get:
 *     summary: Récupérer une affectation par ID
 *     tags: [StudentClasses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donnée trouvée
 *       404:
 *         description: Non trouvé
 */
router.get('/:id', authenticate, getStudentClassById);

/**
 * @swagger
 * /student-classes/student/{studentId}:
 *   get:
 *     summary: Récupérer les classes d’un étudiant
 *     tags: [StudentClasses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des classes
 */
router.get('/student/:studentId', authenticate, getByStudent);

 /**
 * @swagger
 * /student-classes/class/{classId}:
 *   get:
 *     summary: Récupérer les étudiants d’une classe
 *     tags: [StudentClasses]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *     responses:
 *       200:
 *         description: Liste des étudiants de la classe
 *       400:
 *         description: Requête invalide
 */
router.get('/class/:classId', authenticate, getByClass);

/**
 * @swagger
 * /student-classes/school/{schoolId}:
 *   get:
 *     summary: Récupérer les étudiants d’une école
 *     tags: [StudentClasses]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’école
 *     responses:
 *       200:
 *         description: Liste des étudiants de l’école
 *       400:
 *         description: Requête invalide
 */
router.get('/school/:schoolId', authenticate, getBySchool);

/**
 * @swagger
 * /student-classes/{id}:
 *   put:
 *     summary: Mettre à jour une affectation
 *     tags: [StudentClasses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *               academicYear:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mis à jour
 *       404:
 *         description: Non trouvé
 */
router.put('/:id', authenticate, updateStudentClass);

/**
 * @swagger
 * /student-classes/{id}:
 *   delete:
 *     summary: Supprimer une affectation
 *     tags: [StudentClasses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supprimé
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', authenticate, deleteStudentClass);

export default router;