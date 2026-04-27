// src/repositories/teacherAssignment.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createTeacherAssignment = async (data: {
    teacherId: string;
    classId: string;
    subject: string;
    academicYear: string;
}) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO teacher_assignments (
            id,
            "teacherId",
            "classId",
            subject,
            "academicYear",
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `,
        [
            id,
            data.teacherId,
            data.classId,
            data.subject,
            data.academicYear
        ]
    );

    return {
        id,
        ...data
    };
};

// GET ALL (ENRICHI)
export const findTeacherAssignments = async () => {
    const result: any = await db.query(
        `
        SELECT
            ta.*,

            -- Teacher
            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "teacherName",

            -- Class
            c.name AS "className",
            c.level AS "classLevel",

            -- School
            s.name AS "schoolName"

        FROM teacher_assignments ta
        JOIN users u
            ON ta."teacherId" = u.id
        JOIN classes c
            ON ta."classId" = c.id
        JOIN schools s
            ON c."schoolId" = s.id

        ORDER BY ta.created_at DESC
        `
    );

    return result.rows;
};

// GET BY TEACHER
export const findByTeacher = async (
    teacherId: string
) => {
    const result: any = await db.query(
        `
        SELECT
            ta.*,
            c.name AS "className",
            ta.subject

        FROM teacher_assignments ta
        JOIN classes c
            ON ta."classId" = c.id

        WHERE ta."teacherId" = $1

        ORDER BY ta.created_at DESC
        `,
        [teacherId]
    );

    return result.rows;
};

// GET BY CLASS
export const findByClass = async (
    classId: string
) => {
    const result: any = await db.query(
        `
        SELECT
            ta.*,

            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "teacherName"

        FROM teacher_assignments ta
        JOIN users u
            ON ta."teacherId" = u.id

        WHERE ta."classId" = $1

        ORDER BY ta.created_at DESC
        `,
        [classId]
    );

    return result.rows;
};

// DELETE
export const deleteTeacherAssignment = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM teacher_assignments
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};