import { v4 as uuid } from 'uuid';
import * as repo from '../repositories/discipline.repository.js';

// CREATE (SECURISÉ)
export const createReportService = async (user: any, data: any) => {
    if (!user) throw new Error('Unauthorized');

    if (user.role !== 'DIRECTION') {
        throw new Error('Only direction can create discipline reports');
    }

    const id = uuid();

    return repo.createReport({
        ...data,
        id,
        principalId: user.id
    });
};

// GET FILTERED
export const getReportsService = (filters: any) =>
    repo.findReports(filters);

// DELETE
export const deleteReportService = (id: string) =>
    repo.deleteReport(id);