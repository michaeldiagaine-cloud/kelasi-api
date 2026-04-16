import { Router } from 'express';
import {
    createAnnouncement,
    getAnnouncements,
    getBySchool,
    deleteAnnouncement,
    markAsRead,
    getMyAnnouncements
} from '../controllers/announcement.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Créer une annonce
 *     description: Permet de publier une annonce pour une école, une classe ou un élève spécifique
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - schoolId
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Réunion parents"
 *               content:
 *                 type: string
 *                 example: "Une réunion est prévue demain à 10h."
 *               isPinned:
 *                 type: boolean
 *                 example: true
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/file.pdf"]
 *               schoolId:
 *                 type: string
 *                 example: "uuid-school"
 *               classId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-class"
 *               studentId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-student"
 *               createdBy:
 *                 type: string
 *                 example: "uuid-user"
 *     responses:
 *       201:
 *         description: Annonce créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', authenticate, createAnnouncement);

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Liste des annonces
 *     description: Retourne toutes les annonces triées par priorité (pinned en premier)
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: Liste des annonces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', authenticate, getAnnouncements);

/**
 * @swagger
 * /announcements/school/{schoolId}:
 *   get:
 *     summary: Annonces d’une école
 *     description: Retourne toutes les annonces liées à une école spécifique
 *     tags: [Announcements]
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
 *         description: Liste des annonces de l’école
 *       404:
 *         description: Aucune annonce trouvée
 */
router.get('/school/:schoolId', authenticate, getBySchool);

/**
 * @swagger
 * /announcements/me:
 *   get:
 *     summary: Récupérer mes annonces (avec filtre de lecture)
 *     description: Retourne les annonces visibles pour l'utilisateur connecté avec option de filtrage (lu / non lu)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer les annonces lues ou non lues
 *         example: "false"
 *     responses:
 *       200:
 *         description: Liste des annonces filtrées
 */
router.get('/me', authenticate, getMyAnnouncements);

/**
 * @swagger
 * /announcements/{id}/read:
 *   post:
 *     summary: Marquer une annonce comme lue
 *     description: Enregistre qu’un utilisateur a consulté une annonce
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "uuid-announcement"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "uuid-user"
 *     responses:
 *       200:
 *         description: Marqué comme lu
 */
router.post('/:id/read', authenticate, markAsRead);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Supprimer une annonce
 *     description: Supprime une annonce existante
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’annonce
 *         example: "uuid-announcement"
 *     responses:
 *       200:
 *         description: Supprimée avec succès
 *       404:
 *         description: Annonce non trouvée
 */
router.delete('/:id', authenticate, deleteAnnouncement);

export default router;