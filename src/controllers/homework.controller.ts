import type { Request, Response } from 'express';
import * as service from '../services/homework.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createHomework = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        // 🔥 CHECK ROLE
        if (user.role !== 'TEACHER') {
            return errorResponse(res, 'Forbidden: Only teachers can create homework', 403);
        }

        const data = await service.createHomeworkService({
            ...req.body,
            teacherId: user.id // 🔥 sécurisé
        });

        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

export const getFilteredHomeworks = async (req: Request, res: Response) => {
    try {
        const filters = {
            schoolId: req.query.schoolId as string,
            classId: req.query.classId as string,
            academicYear: req.query.academicYear as string,
            date: req.query.date as string
        };

        const data = await service.getFilteredHomeworksService(filters);

        return successResponse(res, data);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// GET ALL
export const getHomeworks = async (_: Request, res: Response) => {
    try {
        const data = await service.getHomeworksService();
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// 🔥 GET MY HOMEWORKS
export const getMyHomeworks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        const data = await service.getMyHomeworksService(userId);

        return successResponse(res, data);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// UPDATE
export const updateHomework = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string; // 🔥 FIX

        await service.updateHomeworkService(id, req.body);

        return successResponse(res, null, 'Updated');
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteHomework = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string; // 🔥 FIX

        const deleted = await service.deleteHomeworkService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};