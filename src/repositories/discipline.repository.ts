// src/repositories/discipline.repository.ts

import { db } from '../config/db.js';

// CREATE
export const createReport = async (data: any) => {
    await db.query(
        `
        INSERT INTO discipline_reports (
            id,
            title,
            description,
            level,
            "actionTaken",
            date,
            "studentId",
            "principalId",
            "academicYear",
            created_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            NOW(), NOW()
        )
        `,
        [
            data.id,
            data.title,
            data.description,
            data.level,
            data.actionTaken || null,
            data.date,
            data.studentId,
            data.principalId,
            data.academicYear
        ]
    );

    return data;
};

// FIND WITH FILTERS + ENRICHI
export const findReports = async (
    filters: any
) => {
    let query = `
        SELECT
            d.*,

            CONCAT(
                us."firstName",
                ' ',
                us."lastName"
            ) AS "studentName",

            CONCAT(
                up."firstName",
                ' ',
                up."lastName"
            ) AS "principalName",

            c.name AS "className",
            sch.name AS "schoolName"

        FROM discipline_reports d

        JOIN students s
            ON d."studentId" = s.id

        JOIN users us
            ON s."userId" = us.id

        JOIN users up
            ON d."principalId" = up.id

        JOIN student_classes sc
            ON sc."studentId" = s.id
            AND sc."isActive" = true

        JOIN classes c
            ON sc."classId" = c.id

        JOIN schools sch
            ON c."schoolId" = sch.id

        WHERE 1=1
    `;

    const values: any[] = [];
    let index = 1;

    if (filters.schoolId) {
        query += ` AND sch.id = $${index}`;
        values.push(filters.schoolId);
        index++;
    }

    if (filters.classId) {
        query += ` AND c.id = $${index}`;
        values.push(filters.classId);
        index++;
    }

    if (filters.studentId) {
        query += ` AND d."studentId" = $${index}`;
        values.push(filters.studentId);
        index++;
    }

    if (filters.level) {
        query += ` AND d.level = $${index}`;
        values.push(filters.level);
        index++;
    }

    if (filters.academicYear) {
        query += ` AND d."academicYear" = $${index}`;
        values.push(filters.academicYear);
        index++;
    }

    if (filters.date) {
        query += ` AND DATE(d.date) = $${index}`;
        values.push(filters.date);
        index++;
    }

    query += `
        ORDER BY d.date DESC
    `;

    const result: any = await db.query(
        query,
        values
    );

    return result.rows;
};

// DELETE
export const deleteReport = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM discipline_reports
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};