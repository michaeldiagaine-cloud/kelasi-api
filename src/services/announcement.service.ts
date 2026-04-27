// src/services/announcement.service.ts

import { db } from '../config/db.js';
import * as repo from '../repositories/announcement.repository.js';

// CREATE
export const createAnnouncementService = async (
    data: any
) => {
    return await repo.createAnnouncement(data);
};

// GET ALL
export const getAnnouncementsService = async () => {
    return await repo.findAnnouncements();
};

// GET BY SCHOOL
export const getBySchoolService = async (
    schoolId: string
) => {
    return await repo.findBySchool(schoolId);
};

// GET MY ANNOUNCEMENTS
export const getMyAnnouncementsService = async (
    userId: string,
    read?: string
) => {
    // sécurité
    if (!userId) {
        throw new Error('Unauthorized');
    }

    // récupérer user
    const userResult: any = await db.query(
        `
        SELECT
            id,
            "schoolId",
            role
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    let studentIds: string[] = [];
    let classIds: string[] = [];

    // ======================
    // PARENT
    // ======================

    if (user.role === 'PARENT') {
        const childrenResult: any =
            await db.query(
                `
                SELECT "studentId"
                FROM parent_students
                WHERE "parentId" = $1
                `,
                [userId]
            );

        studentIds = childrenResult.rows.map(
            (c: any) => c.studentId
        );

        if (studentIds.length > 0) {
            const classesResult: any =
                await db.query(
                    `
                    SELECT "classId"
                    FROM student_classes
                    WHERE "studentId" = ANY($1)
                    AND "isActive" = true
                    `,
                    [studentIds]
                );

            classIds = classesResult.rows.map(
                (c: any) => c.classId
            );
        }
    }

    // ======================
    // STUDENT
    // ======================

    if (user.role === 'STUDENT') {
        const studentResult: any =
            await db.query(
                `
                SELECT id
                FROM students
                WHERE "userId" = $1
                `,
                [userId]
            );

        const student =
            studentResult.rows[0];

        if (student) {
            studentIds = [student.id];

            const classesResult: any =
                await db.query(
                    `
                    SELECT "classId"
                    FROM student_classes
                    WHERE "studentId" = $1
                    AND "isActive" = true
                    `,
                    [student.id]
                );

            classIds = classesResult.rows.map(
                (c: any) => c.classId
            );
        }
    }

    // sécurité SQL
    if (studentIds.length === 0) {
        studentIds = ['__NONE__'];
    }

    if (classIds.length === 0) {
        classIds = ['__NONE__'];
    }

    return await repo.findForUserWithReadFilter(
        userId,
        user.schoolId,
        classIds,
        studentIds,
        read
    );
};

// MARK AS READ
export const markAsReadService = async (
    announcementId: string,
    userId: string
) => {
    return await repo.markAsRead(
        announcementId,
        userId
    );
};

// DELETE
export const deleteAnnouncementService = async (
    id: string
) => {
    return await repo.deleteAnnouncement(id);
};