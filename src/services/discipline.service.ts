// src/services/discipline.service.ts

import { v4 as uuid } from 'uuid';
import * as repo from '../repositories/discipline.repository.js';

// CREATE (SÉCURISÉ)
export const createReportService = async (
    user: any,
    data: any
) => {
    if (!user) {
        throw new Error('Unauthorized');
    }

    // seule la direction peut créer
    if (user.role !== 'DIRECTION') {
        throw new Error(
            'Only direction can create discipline reports'
        );
    }

    const id = uuid();

    return await repo.createReport({
        ...data,
        id,
        principalId: user.id
    });
};

// GET FILTERED
export const getReportsService = async (
    filters: any
) => {
    return await repo.findReports(filters);
};

// DELETE
export const deleteReportService = async (
    id: string
) => {
    return await repo.deleteReport(id);
};