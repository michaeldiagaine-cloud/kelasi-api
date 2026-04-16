import * as repo from '../repositories/justification.repository.js';
import { db } from '../config/db.js';

// CREATE
export const createJustificationService = async (data: any) => {
    // vérifier attendance
    const [rows]: any = await db.query(
        `SELECT status FROM attendance WHERE id = ?`,
        [data.attendanceId]
    );

    if (!rows.length) {
        throw new Error('Attendance not found');
    }

    const status = rows[0].status;

    // règle métier
    if (!['ABSENT', 'LATE'].includes(status)) {
        throw new Error('Justification only allowed for ABSENT or LATE');
    }

    // éviter doublon
    const existing = await repo.findByAttendance(data.attendanceId);

    if (existing) {
        throw new Error('Justification already exists');
    }

    return repo.createJustification(data);
};

// GET
export const getJustificationByAttendanceService = async (attendanceId: string) => {
    return repo.findByAttendance(attendanceId);
};

// REVIEW
export const reviewJustificationService = async (id: string, data: any) => {
    return repo.reviewJustification(id, data);
};

// DELETE
export const deleteJustificationService = async (id: string) => {
    return repo.deleteJustification(id);
};