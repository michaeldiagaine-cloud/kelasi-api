// src/repositories/attendance.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createAttendance = async (data: any) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO attendance (
            id,
            date,
            status,
            note,
            "studentId",
            "classId",
            "academicYear",
            "markedBy",
            "markedAt",
            created_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, NOW(),
            NOW(), NOW()
        )
        `,
        [
            id,
            data.date,
            data.status,
            data.note || null,
            data.studentId,
            data.classId,
            data.academicYear,
            data.markedBy
        ]
    );

    return {
        id,
        ...data
    };
};

// GET ALL (ENRICHI)
export const findAttendance = async () => {
    const result: any = await db.query(
        `
        SELECT
            a.*,

            -- Student
            CONCAT(
                us."firstName",
                ' ',
                us."lastName"
            ) AS "studentName",

            -- Class
            c.name AS "className",

            -- School
            sch.name AS "schoolName",

            -- Marked By
            CONCAT(
                um."firstName",
                ' ',
                um."lastName"
            ) AS "markedByName",

            -- Justification
            j.id AS "justificationId",
            j.reason,
            j."documentUrl",
            j.status AS "justificationStatus"

        FROM attendance a

        JOIN students s
            ON a."studentId" = s.id
        JOIN users us
            ON s."userId" = us.id

        JOIN classes c
            ON a."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id

        JOIN users um
            ON a."markedBy" = um.id

        LEFT JOIN absence_justifications j
            ON j."attendanceId" = a.id
            AND a.status IN ('ABSENT', 'LATE')

        ORDER BY a.date DESC
        `
    );

    return result.rows.map((row: any) => ({
        ...row,
        justification: row.justificationId
            ? {
                  id: row.justificationId,
                  reason: row.reason,
                  documentUrl: row.documentUrl,
                  status: row.justificationStatus
              }
            : null
    }));
};

// GET BY CLASS + DATE
export const findByClassAndDate = async (
    classId: string,
    date: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM attendance
        WHERE "classId" = $1
        AND date = $2
        `,
        [classId, date]
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
            a.*,

            CONCAT(
                us."firstName",
                ' ',
                us."lastName"
            ) AS "studentName",

            c.name AS "className",
            sch.name AS "schoolName",

            CONCAT(
                um."firstName",
                ' ',
                um."lastName"
            ) AS "markedByName"

        FROM attendance a

        JOIN students s
            ON a."studentId" = s.id
        JOIN users us
            ON s."userId" = us.id
        JOIN classes c
            ON a."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id
        JOIN users um
            ON a."markedBy" = um.id

        WHERE sch.id = $1

        ORDER BY a.date DESC
        `,
        [schoolId]
    );

    return result.rows;
};

// GET BY CLASS
export const findByClass = async (
    classId: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM attendance
        WHERE "classId" = $1
        ORDER BY date DESC
        `,
        [classId]
    );

    return result.rows;
};

// GET BY DATE
export const findByDate = async (
    date: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM attendance
        WHERE date = $1
        `,
        [date]
    );

    return result.rows;
};

// GET BY YEAR
export const findByAcademicYear = async (
    year: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM attendance
        WHERE "academicYear" = $1
        `,
        [year]
    );

    return result.rows;
};

// GET BY STUDENT
export const findByStudent = async (
    studentId: string,
    filters?: {
        date?: string;
        academicYear?: string;
    }
) => {
    let query = `
        SELECT
            a.*,

            CONCAT(
                us."firstName",
                ' ',
                us."lastName"
            ) AS "studentName",

            c.name AS "className",
            sch.name AS "schoolName",

            CONCAT(
                um."firstName",
                ' ',
                um."lastName"
            ) AS "markedByName"

        FROM attendance a

        JOIN students s
            ON a."studentId" = s.id
        JOIN users us
            ON s."userId" = us.id
        JOIN classes c
            ON a."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id
        JOIN users um
            ON a."markedBy" = um.id

        WHERE a."studentId" = $1
    `;

    const values: any[] = [studentId];
    let index = 2;

    if (filters?.date) {
        query += ` AND DATE(a.date) = $${index}`;
        values.push(filters.date);
        index++;
    }

    if (filters?.academicYear) {
        query += ` AND a."academicYear" = $${index}`;
        values.push(filters.academicYear);
        index++;
    }

    query += ` ORDER BY a.date DESC`;

    const result: any = await db.query(
        query,
        values
    );

    return result.rows;
};

// FILTERS
export const findWithFilters = async (
    filters: any
) => {
    let query = `
        SELECT
            a.*,

            CONCAT(
                us."firstName",
                ' ',
                us."lastName"
            ) AS "studentName",

            c.name AS "className",
            sch.name AS "schoolName",

            CONCAT(
                um."firstName",
                ' ',
                um."lastName"
            ) AS "markedByName"

        FROM attendance a
        JOIN students s
            ON a."studentId" = s.id
        JOIN users us
            ON s."userId" = us.id
        JOIN classes c
            ON a."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id
        JOIN users um
            ON a."markedBy" = um.id
    `;

    const conditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (filters.schoolId) {
        conditions.push(`sch.id = $${index}`);
        values.push(filters.schoolId);
        index++;
    }

    if (filters.classId) {
        conditions.push(`a."classId" = $${index}`);
        values.push(filters.classId);
        index++;
    }

    if (filters.academicYear) {
        conditions.push(`a."academicYear" = $${index}`);
        values.push(filters.academicYear);
        index++;
    }

    if (filters.date) {
        conditions.push(`DATE(a.date) = $${index}`);
        values.push(filters.date);
        index++;
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY a.date DESC`;

    const result: any = await db.query(
        query,
        values
    );

    return result.rows;
};

// UPDATE
export const updateAttendance = async (
    id: string,
    data: any
) => {
    await db.query(
        `
        UPDATE attendance
        SET
            status = COALESCE($1, status),
            note = COALESCE($2, note),
            updated_at = NOW()
        WHERE id = $3
        `,
        [
            data.status ?? null,
            data.note ?? null,
            id
        ]
    );

    return true;
};

// DELETE
export const deleteAttendance = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM attendance
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};