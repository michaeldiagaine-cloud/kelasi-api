import type { Request, Response } from 'express';
import * as service from '../services/justification.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createJustification = async (req: Request, res: Response) => {
    try {
        const data = await service.createJustificationService(req.body);
        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        console.error(err);
        return errorResponse(res, err.message);
    }
};

// GET BY ATTENDANCE
export const getByAttendance = async (req: Request, res: Response) => {
    try {
        const attendanceId = req.params.attendanceId as string;
        const data = await service.getJustificationByAttendanceService(attendanceId);
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// REVIEW
export const reviewJustification = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await service.reviewJustificationService(id, req.body);
        return successResponse(res, null, 'Reviewed');
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteJustification = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const deleted = await service.deleteJustificationService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};