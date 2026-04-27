// src/repositories/studentClass.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createStudentClass = async (data: {
    studentId: string;
    classId: string;
    academicYear: string;
    isActive: boolean;
}) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO student_classes (
            id,
            "studentId",
            "classId",
            "academicYear",
            "isActive",
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `,
        [
            id,
            data.studentId,
            data.classId,
            data.academicYear,
            data.isActive
        ]
    );

    return {
        id,
        ...data
    };
};

// GET ALL
export const findStudentClasses = async () => {
    const result: any = await db.query(
        `
        SELECT
            sc.id,
            sc."academicYear",
            sc."isActive",

            sc."studentId",
            sc."classId",

            -- Student
            s."studentCode",
            u."firstName",
            u."lastName",
            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "studentName",

            -- Class
            c.name AS "className",
            c.level AS "classLevel",

            -- School
            sch.id AS "schoolId",
            sch.name AS "schoolName"

        FROM student_classes sc
        JOIN students s
            ON sc."studentId" = s.id
        JOIN users u
            ON s."userId" = u.id
        JOIN classes c
            ON sc."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id

        ORDER BY sc.created_at DESC
        `
    );

    return result.rows;
};

// GET BY ID
export const findStudentClassById = async (
    id: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM student_classes
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

// GET BY STUDENT
export const findByStudent = async (
    studentId: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM student_classes
        WHERE "studentId" = $1
        ORDER BY created_at DESC
        `,
        [studentId]
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
            sc.*,

            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "studentName",

            c.name AS "className",
            sch.name AS "schoolName"

        FROM student_classes sc
        JOIN students s
            ON sc."studentId" = s.id
        JOIN users u
            ON s."userId" = u.id
        JOIN classes c
            ON sc."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id

        WHERE sc."classId" = $1

        ORDER BY sc.created_at DESC
        `,
        [classId]
    );

    return result.rows;
};

// GET BY SCHOOL
export const findBySchool = async (
    schoolId: string
) => {
    const result: any = await db.query(
        `
        SELECT
            sc.*,

            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "studentName",

            c.name AS "className",
            sch.name AS "schoolName"

        FROM student_classes sc
        JOIN students s
            ON sc."studentId" = s.id
        JOIN users u
            ON s."userId" = u.id
        JOIN classes c
            ON sc."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id

        WHERE sch.id = $1

        ORDER BY sc.created_at DESC
        `,
        [schoolId]
    );

    return result.rows;
};

// UPDATE
export const updateStudentClass = async (
    id: string,
    data: any
) => {
    await db.query(
        `
        UPDATE student_classes
        SET
            "classId" = COALESCE($1, "classId"),
            "academicYear" = COALESCE($2, "academicYear"),
            "isActive" = COALESCE($3, "isActive"),
            updated_at = NOW()
        WHERE id = $4
        `,
        [
            data.classId ?? null,
            data.academicYear ?? null,
            data.isActive ?? null,
            id
        ]
    );

    return await findStudentClassById(id);
};

// DELETE
export const deleteStudentClass = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM student_classes
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};