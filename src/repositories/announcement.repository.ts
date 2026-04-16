import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

export const createAnnouncement = async (data: any) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO announcements
        (id, title, content, isPinned, attachments, schoolId, classId, studentId, createdBy, publishedAt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            data.title,
            data.content,
            data.isPinned || false,
            JSON.stringify(data.attachments || []),
            data.schoolId,
            data.classId || null,
            data.studentId || null,
            data.createdBy,
            now,
            now,
            now
        ]
    );

    return { id, ...data };
};

export const findAnnouncements = async () => {
    const [rows]: any = await db.query(
        `SELECT 
            a.*,

            CONCAT(u.firstName,' ',u.lastName) AS authorName,
            s.name AS schoolName,

            COUNT(ar.id) AS readsCount

         FROM announcements a

         JOIN users u ON a.createdBy = u.id
         JOIN schools s ON a.schoolId = s.id

         LEFT JOIN announcement_reads ar 
            ON ar.announcementId = a.id

         GROUP BY a.id

         ORDER BY a.isPinned DESC, a.publishedAt DESC`
    );

    return rows.map((row: any) => ({
        ...row,

        attachments: JSON.parse(row.attachments || '[]'),

        _count: {
            reads: row.readsCount
        }
    }));
};

export const findBySchool = async (schoolId: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM announcements WHERE schoolId = ?`,
        [schoolId]
    );

    return rows;
};

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

            s.name AS schoolName,
            CONCAT(u.firstName,' ',u.lastName) AS authorName,

            ar.userId IS NOT NULL AS isRead

        FROM announcements a

        JOIN schools s ON a.schoolId = s.id
        JOIN users u ON a.createdBy = u.id

        LEFT JOIN announcement_reads ar 
            ON ar.announcementId = a.id
            AND ar.userId = ?

        WHERE 
            a.schoolId = ?
            OR a.classId IN (?)
            OR a.studentId IN (?)
    `;

    const values: any[] = [userId, schoolId, classIds, studentIds];

    // 🔥 filtre lecture
    if (read === 'true') {
        query += ' AND ar.userId IS NOT NULL';
    }

    if (read === 'false') {
        query += ' AND ar.userId IS NULL';
    }

    query += ' ORDER BY a.isPinned DESC, a.publishedAt DESC';

    const [rows]: any = await db.query(query, values);

    return rows.map((row: any) => ({
        ...row,
        attachments: JSON.parse(row.attachments || '[]'),
        isRead: !!row.isRead
    }));
};

export const markAsRead = async (announcementId: string, userId: string) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT IGNORE INTO announcement_reads
        (id, announcementId, userId, readAt)
        VALUES (?, ?, ?, ?)`,
        [id, announcementId, userId, now]
    );

    return true;
};

export const deleteAnnouncement = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM announcements WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};