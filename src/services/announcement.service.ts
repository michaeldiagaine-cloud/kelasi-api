import { db } from '../config/db.js';
import * as repo from '../repositories/announcement.repository.js';

export const createAnnouncementService = (data: any) =>
    repo.createAnnouncement(data);

export const getAnnouncementsService = () =>
    repo.findAnnouncements();

export const getBySchoolService = (schoolId: string) =>
    repo.findBySchool(schoolId);

export const getMyAnnouncementsService = async (
    userId: string,
    read?: string
) => {
    // 🔐 1. Vérifier userId
    if (!userId) {
        throw new Error('Unauthorized');
    }

    // 🔥 2. Récupérer user
    const [userRows]: any = await db.query(
        `SELECT id, schoolId, role FROM users WHERE id = ?`,
        [userId]
    );

    const user = userRows[0];

    if (!user) {
        throw new Error('User not found');
    }

    let studentIds: string[] = [];
    let classIds: string[] = [];

    // ======================
    // 👨‍👩‍👧‍👦 PARENT
    // ======================
    if (user.role === 'PARENT') {
        const [children]: any = await db.query(
            `SELECT studentId FROM parent_students WHERE parentId = ?`,
            [userId]
        );

        studentIds = children.map((c: any) => c.studentId);

        if (studentIds.length > 0) {
            const [classes]: any = await db.query(
                `SELECT classId FROM student_classes 
                 WHERE studentId IN (?) AND isActive = 1`,
                [studentIds]
            );

            classIds = classes.map((c: any) => c.classId);
        }
    }

    // ======================
    // 🎓 STUDENT
    // ======================
    if (user.role === 'STUDENT') {
        // ⚠️ récupérer le vrai studentId
        const [studentRows]: any = await db.query(
            `SELECT id FROM students WHERE userId = ?`,
            [userId]
        );

        const student = studentRows[0];

        if (student) {
            studentIds = [student.id];

            const [classes]: any = await db.query(
                `SELECT classId FROM student_classes 
                 WHERE studentId = ? AND isActive = 1`,
                [student.id]
            );

            classIds = classes.map((c: any) => c.classId);
        }
    }

    // ======================
    // 🛡️ SÉCURITÉ SQL
    // ======================

    // éviter IN ()
    if (studentIds.length === 0) {
        studentIds = ['__NONE__'];
    }

    if (classIds.length === 0) {
        classIds = ['__NONE__'];
    }

    // ======================
    // 🚀 RESULTAT
    // ======================
    return repo.findForUserWithReadFilter(
        userId,
        user.schoolId,
        classIds,
        studentIds,
        read
    );
};

export const markAsReadService = async (
    announcementId: string,
    userId: string
) => {
    return repo.markAsRead(announcementId, userId);
};

export const deleteAnnouncementService = (id: string) =>
    repo.deleteAnnouncement(id);