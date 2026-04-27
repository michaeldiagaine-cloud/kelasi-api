// src/repositories/announcement.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createAnnouncement = async (data: any) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO announcements (
            id,
            title,
            content,
            "isPinned",
            attachments,
            "schoolId",
            "classId",
            "studentId",
            "createdBy",
            "publishedAt",
            created_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            NOW(), NOW(), NOW()
        )
        `,
        [
            id,
            data.title,
            data.content,
            data.isPinned || false,
            JSON.stringify(data.attachments || []),
            data.schoolId,
            data.classId || null,
            data.studentId || null,
            data.createdBy
        ]
    );

    return {
        id,
        ...data
    };
};

// GET ALL
export const findAnnouncements = async () => {
    const result: any = await db.query(
        `
        SELECT
            a.*,

            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "authorName",

            s.name AS "schoolName",

            COUNT(ar.id) AS "readsCount"

        FROM announcements a

        JOIN users u
            ON a."createdBy" = u.id

        JOIN schools s
            ON a."schoolId" = s.id

        LEFT JOIN announcement_reads ar
            ON ar."announcementId" = a.id

        GROUP BY
            a.id,
            u."firstName",
            u."lastName",
            s.name

        ORDER BY
            a."isPinned" DESC,
            a."publishedAt" DESC
        `
    );

    return result.rows.map((row: any) => ({
        ...row,
        attachments: JSON.parse(
            row.attachments || '[]'
        ),
        _count: {
            reads: Number(row.readsCount || 0)
        }
    }));
};

// GET BY SCHOOL
export const findBySchool = async (
    schoolId: string
) => {
    const result: any = await db.query(
        `
        SELECT *
        FROM announcements
        WHERE "schoolId" = $1
        ORDER BY "publishedAt" DESC
        `,
        [schoolId]
    );

    return result.rows;
};

// GET FOR USER + READ FILTER
export const findForUserWithReadFilter = async (
    userId: string,
    schoolId: string,
    classIds: string[],
    studentIds: string[],
    read?: string
) => {
    let query = `
        SELECT
            a.*,

            s.name AS "schoolName",

            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "authorName",

            CASE
                WHEN ar."userId" IS NOT NULL
                THEN true
                ELSE false
            END AS "isRead"

        FROM announcements a

        JOIN schools s
            ON a."schoolId" = s.id

        JOIN users u
            ON a."createdBy" = u.id

        LEFT JOIN announcement_reads ar
            ON ar."announcementId" = a.id
            AND ar."userId" = $1

        WHERE
            a."schoolId" = $2
            OR a."classId" = ANY($3)
            OR a."studentId" = ANY($4)
    `;

    const values: any[] = [
        userId,
        schoolId,
        classIds,
        studentIds
    ];

    if (read === 'true') {
        query += `
            AND ar."userId" IS NOT NULL
        `;
    }

    if (read === 'false') {
        query += `
            AND ar."userId" IS NULL
        `;
    }

    query += `
        ORDER BY
            a."isPinned" DESC,
            a."publishedAt" DESC
    `;

    const result: any = await db.query(
        query,
        values
    );

    return result.rows.map((row: any) => ({
        ...row,
        attachments: JSON.parse(
            row.attachments || '[]'
        ),
        isRead: !!row.isRead
    }));
};

// MARK AS READ
export const markAsRead = async (
    announcementId: string,
    userId: string
) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO announcement_reads (
            id,
            "announcementId",
            "userId",
            "readAt"
        )
        VALUES (
            $1, $2, $3, NOW()
        )
        ON CONFLICT DO NOTHING
        `,
        [
            id,
            announcementId,
            userId
        ]
    );

    return true;
};

// DELETE
export const deleteAnnouncement = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM announcements
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};