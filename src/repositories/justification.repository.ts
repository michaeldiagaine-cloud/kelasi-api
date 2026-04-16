import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createJustification = async (data: any) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO absence_justifications
        (id, reason, documentUrl, status, attendanceId, created_at, updated_at)
        VALUES (?, ?, ?, 'PENDING', ?, ?, ?)`,
        [
            id,
            data.reason,
            data.documentUrl || null,
            data.attendanceId,
            now,
            now
        ]
    );

    return { id, ...data, status: 'PENDING' };
};

// GET BY ATTENDANCE
export const findByAttendance = async (attendanceId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            j.*,
            CONCAT(u.firstName,' ',u.lastName) AS reviewedByName
         FROM absence_justifications j
         LEFT JOIN users u ON j.reviewedBy = u.id
         WHERE j.attendanceId = ?`,
        [attendanceId]
    );

    return rows[0] || null;
};

// REVIEW (APPROVE / REJECT)
export const reviewJustification = async (id: string, data: any) => {
    const now = new Date();

    await db.query(
        `UPDATE absence_justifications
         SET status = ?, reviewedBy = ?, updated_at = ?
         WHERE id = ?`,
        [data.status, data.reviewedBy, now, id]
    );

    return true;
};

// DELETE
export const deleteJustification = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM absence_justifications WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};