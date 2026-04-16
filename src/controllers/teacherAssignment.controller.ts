import type { Request, Response } from 'express';
import * as service from '../services/teacherAssignment.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createTeacherAssignment = async (req: Request, res: Response) => {
    try {
        const { teacherId, classId, subject, academicYear } = req.body;

        if (!teacherId || !classId || !subject || !academicYear) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        const data = await service.createTeacherAssignmentService(req.body);

        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// GET ALL
export const getTeacherAssignments = async (_: Request, res: Response) => {
    try {
        const data = await service.getTeacherAssignmentsService();
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY TEACHER
export const getByTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.teacherId as string;
        const data = await service.getByTeacherService(teacherId);
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY CLASS
export const getByClass = async (req: Request, res: Response) => {
    try {
        const classId = req.params.classId as string;
        const data = await service.getByClassService(classId);
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteTeacherAssignment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await service.deleteTeacherAssignmentService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};