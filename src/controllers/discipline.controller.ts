import type { Request, Response } from 'express';
import * as service from '../services/discipline.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createReport = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        const data = await service.createReportService(user, req.body);

        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// GET FILTERED
export const getReports = async (req: Request, res: Response) => {
    try {
        const filters = {
            schoolId: req.query.schoolId as string,
            classId: req.query.classId as string,
            studentId: req.query.studentId as string,
            level: req.query.level as string,
            academicYear: req.query.academicYear as string,
            date: req.query.date as string
        };

        const data = await service.getReportsService(filters);

        return successResponse(res, data);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// DELETE
export const deleteReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await service.deleteReportService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};