// src/services/homework.service.ts

import { v4 as uuid } from 'uuid';
import { db } from '../config/db.js';
import * as repo from '../repositories/homework.repository.js';

// CREATE
export const createHomeworkService = async (
    data: any
) => {
    const id = uuid();

    // vérifier teacher existe
    const teacherResult: any = await db.query(
        `
        SELECT
            id,
            role
        FROM users
        WHERE id = $1
        `,
        [data.teacherId]
    );

    const user = teacherResult.rows[0];

    if (!user) {
        throw new Error('Teacher not found');
    }

    if (user.role !== 'TEACHER') {
        throw new Error('User is not a teacher');
    }

    return await repo.createHomework({
        ...data,
        id
    });
};

// GET ALL
export const getHomeworksService = async () => {
    return await repo.findHomeworks();
};

// GET MY HOMEWORKS
export const getMyHomeworksService = async (
    userId: string
) => {
    const userResult: any = await db.query(
        `
        SELECT
            id,
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

    let classIds: string[] = [];

    // STUDENT
    if (user.role === 'STUDENT') {
        const studentResult: any = await db.query(
            `
            SELECT id
            FROM students
            WHERE "userId" = $1
            `,
            [userId]
        );

        const student = studentResult.rows[0];

        if (student) {
            const classesResult: any = await db.query(
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

    // PARENT
    if (user.role === 'PARENT') {
        const childrenResult: any = await db.query(
            `
            SELECT "studentId"
            FROM parent_students
            WHERE "parentId" = $1
            `,
            [userId]
        );

        const studentIds = childrenResult.rows.map(
            (c: any) => c.studentId
        );

        if (studentIds.length > 0) {
            const classesResult: any = await db.query(
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

    // sécurité SQL
    if (classIds.length === 0) {
        classIds = ['__NONE__'];
    }

    return await repo.findByClasses(classIds);
};

// FILTERS
export const getFilteredHomeworksService = async (
    filters: any
) => {
    return await repo.findWithFilters(filters);
};

// UPDATE
export const updateHomeworkService = async (
    id: string,
    data: any
) => {
    return await repo.updateHomework(id, data);
};

// DELETE
export const deleteHomeworkService = async (
    id: string
) => {
    return await repo.deleteHomework(id);
};