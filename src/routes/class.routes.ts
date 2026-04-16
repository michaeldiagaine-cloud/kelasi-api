import { Router } from 'express';
import {
    createClass,
    deleteClass,
    getClassById,
    getClasses,
    getClassesBySchool,
    updateClass
} from '../controllers/class.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Créer une classe
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - level
 *               - schoolId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "6ème A"
 *               level:
 *                 type: string
 *                 example: "6ème"
 *               schoolId:
 *                 type: string
 *                 example: "edc5c11e-2d47-4c45-b914-5684c3d86eb7"
 *     responses:
 *       201:
 *         description: Classe créée
 *       400:
 *         description: Erreur de validation
 */
router.post('/', authenticate, createClass);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Récupérer toutes les classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des classes
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticate, getClasses);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Récupérer une classe par ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *     responses:
 *       200:
 *         description: Classe trouvée
 *       404:
 *         description: Classe non trouvée
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticate, getClassById);

/**
 * @swagger
 * /classes/school/{schoolId}:
 *   get:
 *     summary: Récupérer les classes d'une école
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école
 *     responses:
 *       200:
 *         description: Liste des classes de l'école
 *       401:
 *         description: Non authentifié
 */
router.get('/school/:schoolId', authenticate, getClassesBySchool);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Mettre à jour une classe
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *               schoolId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Classe mise à jour
 *       404:
 *         description: Classe non trouvée
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticate, updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Supprimer une classe
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *     responses:
 *       200:
 *         description: Classe supprimée
 *       404:
 *         description: Classe non trouvée
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticate, deleteClass);

export default router;