// src/repositories/homework.repository.ts

import { db } from '../config/db.js';

// CREATE
export const createHomework = async (data: any) => {
    await db.query(
        `
        INSERT INTO homeworks (
            id,
            title,
            description,
            subject,
            "dueDate",
            attachments,
            "classId",
            "teacherId",
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
            data.subject,
            data.dueDate,
            JSON.stringify(data.attachments || []),
            data.classId,
            data.teacherId,
            data.academicYear
        ]
    );

    return data;
};

// GET ALL
export const findHomeworks = async () => {
    const result: any = await db.query(`
        SELECT * 
        FROM homeworks
        ORDER BY "dueDate" ASC
    `);

    return result.rows.map((row: any) => ({
        ...row,
        attachments: JSON.parse(row.attachments || '[]')
    }));
};

// GET BY CLASSES
export const findByClasses = async (classIds: string[]) => {
    const result: any = await db.query(
        `
        SELECT
            h.*,
            c.name AS "className",
            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "teacherName"

        FROM homeworks h
        JOIN classes c
            ON h."classId" = c.id
        JOIN users u
            ON h."teacherId" = u.id

        WHERE h."classId" = ANY($1)

        ORDER BY h."dueDate" ASC
        `,
        [classIds]
    );

    return result.rows.map((row: any) => ({
        ...row,
        attachments: JSON.parse(row.attachments || '[]')
    }));
};

// FILTERS
export const findWithFilters = async (filters: any) => {
    let query = `
        SELECT
            h.*,
            c.name AS "className",
            sch.name AS "schoolName",
            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "teacherName"

        FROM homeworks h
        JOIN classes c
            ON h."classId" = c.id
        JOIN schools sch
            ON c."schoolId" = sch.id
        JOIN users u
            ON h."teacherId" = u.id

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
        query += ` AND h."classId" = $${index}`;
        values.push(filters.classId);
        index++;
    }

    if (filters.academicYear) {
        query += ` AND h."academicYear" = $${index}`;
        values.push(filters.academicYear);
        index++;
    }

    if (filters.date) {
        query += ` AND DATE(h."dueDate") = $${index}`;
        values.push(filters.date);
        index++;
    }

    query += ` ORDER BY h."dueDate" ASC`;

    const result: any = await db.query(query, values);

    return result.rows.map((row: any) => ({
        ...row,
        attachments: JSON.parse(row.attachments || '[]')
    }));
};

// UPDATE
export const updateHomework = async (
    id: string,
    data: any
) => {
    await db.query(
        `
        UPDATE homeworks
        SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            subject = COALESCE($3, subject),
            "dueDate" = COALESCE($4, "dueDate"),
            attachments = COALESCE($5, attachments),
            updated_at = NOW()
        WHERE id = $6
        `,
        [
            data.title ?? null,
            data.description ?? null,
            data.subject ?? null,
            data.dueDate ?? null,
            data.attachments
                ? JSON.stringify(data.attachments)
                : null,
            id
        ]
    );

    return true;
};

// DELETE
export const deleteHomework = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM homeworks
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};