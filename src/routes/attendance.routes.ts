import { Router } from 'express';
import {
    createAttendance,
    getAttendance,
    updateAttendance,
    deleteAttendance,
    getByStudent,
    getByYear,
    getByDate,
    getByClass,
    getBySchool,
    getAttendanceWithFilters
} from '../controllers/attendance.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /attendance/student/{studentId}:
 *   get:
 *     summary: Récupérer les présences d’un élève (filtrable)
 *     description: Permet de filtrer par date et année scolaire
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         example: "2026-04-10"
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *         example: "2025-2026"
 */
router.get('/student/:studentId', authenticate, getByStudent);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Liste des présences
 *     description: Retourne toutes les présences avec informations enrichies
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des présences
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
 */
router.get('/', getAttendance);

/**
 * @swagger
 * /attendance/school/{schoolId}:
 *   get:
 *     summary: Récupérer les présences d’une école
 *     description: Retourne toutes les présences des élèves appartenant à une école
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
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
 *         description: Liste des présences de l’école
 *       404:
 *         description: Aucune donnée trouvée
 */
router.get('/school/:schoolId', getBySchool);

/**
 * @swagger
 * /attendance/class/{classId}:
 *   get:
 *     summary: Récupérer les présences d’une classe
 *     description: Retourne toutes les présences pour une classe donnée
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *         example: "uuid-class"
 *     responses:
 *       200:
 *         description: Liste des présences de la classe
 */
router.get('/class/:classId', getByClass);

/**
 * @swagger
 * /attendance/date/{date}:
 *   get:
 *     summary: Récupérer les présences par date
 *     description: Retourne toutes les présences enregistrées pour une date donnée
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Date au format YYYY-MM-DD
 *         example: "2026-04-10"
 *     responses:
 *       200:
 *         description: Liste des présences pour la date
 */
router.get('/date/:date', getByDate);

/**
 * @swagger
 * /attendance/year/{year}:
 *   get:
 *     summary: Récupérer les présences par année scolaire
 *     description: Retourne toutes les présences pour une année scolaire donnée
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Année scolaire
 *         example: "2025-2026"
 *     responses:
 *       200:
 *         description: Liste des présences de l’année scolaire
 */
router.get('/year/:year', getByYear);

/**
 * @swagger
 * /attendance/student/{studentId}:
 *   get:
 *     summary: Récupérer les présences d’un élève (filtrable)
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des présences
 */
router.post('/', authenticate, createAttendance);

/**
 * @swagger
 * /attendance/filter:
 *   get:
 *     summary: Filtrer les présences (multi-critères)
 *     description: Permet de filtrer les présences par école, classe, date et année scolaire
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: ID de l’école
 *         example: "uuid-school"
 *
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: ID de la classe
 *         example: "uuid-class"
 *
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *         description: Année scolaire
 *         example: "2025-2026"
 *
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Date (YYYY-MM-DD)
 *         example: "2026-04-10"
 *
 *     responses:
 *       200:
 *         description: Liste filtrée des présences
 */
router.get('/filter', authenticate, getAttendanceWithFilters);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Mettre à jour une présence
 *     description: Modifie le statut ou la note d'une présence
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la présence
 *         example: "uuid-attendance"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE, EXCUSED]
 *                 example: "ABSENT"
 *               note:
 *                 type: string
 *                 example: "Malade"
 *     responses:
 *       200:
 *         description: Mise à jour réussie
 *       404:
 *         description: Présence non trouvée
 */
router.put('/:id', authenticate, updateAttendance);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Supprimer une présence
 *     description: Supprime une entrée de présence
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la présence
 *         example: "uuid-attendance"
 *     responses:
 *       200:
 *         description: Supprimé avec succès
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', authenticate, deleteAttendance);

export default router;