// src/repositories/justification.repository.ts

import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createJustification = async (
    data: any
) => {
    const id = uuid();

    await db.query(
        `
        INSERT INTO absence_justifications (
            id,
            reason,
            "documentUrl",
            status,
            "attendanceId",
            created_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, 'PENDING',
            $4, NOW(), NOW()
        )
        `,
        [
            id,
            data.reason,
            data.documentUrl || null,
            data.attendanceId
        ]
    );

    return {
        id,
        ...data,
        status: 'PENDING'
    };
};

// GET BY ATTENDANCE
export const findByAttendance = async (
    attendanceId: string
) => {
    const result: any = await db.query(
        `
        SELECT
            j.*,

            CONCAT(
                u."firstName",
                ' ',
                u."lastName"
            ) AS "reviewedByName"

        FROM absence_justifications j

        LEFT JOIN users u
            ON j."reviewedBy" = u.id

        WHERE j."attendanceId" = $1
        `,
        [attendanceId]
    );

    return result.rows[0] || null;
};

// REVIEW (APPROVE / REJECT)
export const reviewJustification = async (
    id: string,
    data: any
) => {
    await db.query(
        `
        UPDATE absence_justifications
        SET
            status = $1,
            "reviewedBy" = $2,
            updated_at = NOW()
        WHERE id = $3
        `,
        [
            data.status,
            data.reviewedBy,
            id
        ]
    );

    return true;
};

// DELETE
export const deleteJustification = async (
    id: string
) => {
    const result: any = await db.query(
        `
        DELETE FROM absence_justifications
        WHERE id = $1
        `,
        [id]
    );

    return result.rowCount > 0;
};