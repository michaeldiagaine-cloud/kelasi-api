// src/services/justification.service.ts

import * as repo from '../repositories/justification.repository.js';
import { db } from '../config/db.js';

// CREATE
export const createJustificationService = async (
    data: any
) => {
    // vérifier attendance
    const attendanceResult: any = await db.query(
        `
        SELECT status
        FROM attendance
        WHERE id = $1
        `,
        [data.attendanceId]
    );

    const attendance =
        attendanceResult.rows[0];

    if (!attendance) {
        throw new Error(
            'Attendance not found'
        );
    }

    const status = attendance.status;

    // règle métier :
    // justification seulement si
    // ABSENT ou LATE

    if (
        !['ABSENT', 'LATE'].includes(
            status
        )
    ) {
        throw new Error(
            'Justification only allowed for ABSENT or LATE'
        );
    }

    // éviter doublon
    const existing =
        await repo.findByAttendance(
            data.attendanceId
        );

    if (existing) {
        throw new Error(
            'Justification already exists'
        );
    }

    return await repo.createJustification(
        data
    );
};

// GET
export const getJustificationByAttendanceService =
    async (
        attendanceId: string
    ) => {
        return await repo.findByAttendance(
            attendanceId
        );
    };

// REVIEW
export const reviewJustificationService =
    async (
        id: string,
        data: any
    ) => {
        return await repo.reviewJustification(
            id,
            data
        );
    };

// DELETE
export const deleteJustificationService =
    async (id: string) => {
        return await repo.deleteJustification(
            id
        );
    };