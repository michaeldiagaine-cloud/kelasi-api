// src/routes/school.routes.ts
import { Router } from 'express';
import {
    createSchool,
    getSchools,
    getSchoolById,
    updateSchool,
    deleteSchool
} from '../controllers/school.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /schools:
 *   post:
 *     summary: Créer une école
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: École créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 code:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Nom ou code manquant
 */
router.post('/', authenticate, createSchool);

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Récupérer toutes les écoles
 *     tags: [Schools]
 *     responses:
 *       200:
 *         description: Liste des écoles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *                   status:
 *                     type: string
 */
// router.get('/', authenticate, getSchools);
router.get('/', authenticate, getSchools);
/**
 * @swagger
 * /schools/{id}:
 *   get:
 *     summary: Récupérer une école par son ID
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école
 *     responses:
 *       200:
 *         description: École trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 code:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: École non trouvée
 */
router.get('/:id', authenticate, getSchoolById);

/**
 * @swagger
 * /schools/{id}:
 *   put:
 *     summary: Mettre à jour une école
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: École mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 code:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: École non trouvée
 */
router.put('/:id', authenticate, updateSchool);

/**
 * @swagger
 * /schools/{id}:
 *   delete:
 *     summary: Supprimer une école
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école à supprimer
 *     responses:
 *       200:
 *         description: École supprimée
 *       404:
 *         description: École non trouvée
 */
router.delete('/:id', authenticate, deleteSchool);

export default router;