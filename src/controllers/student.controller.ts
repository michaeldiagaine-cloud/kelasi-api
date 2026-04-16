import type { Request, Response } from 'express';
import * as studentService from '../services/student.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createStudent = async (req: Request, res: Response) => {
    try {
        const { userId, studentCode } = req.body;

        if (!userId || !studentCode) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        const data = await studentService.createStudentService(req.body);
        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// GET ALL
export const getStudents = async (_: Request, res: Response) => {
    try {
        const data = await studentService.getStudentsService();
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY ID
export const getStudentById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const data = await studentService.getStudentByIdService(id);

        if (!data) return errorResponse(res, 'Student not found', 404);

        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// UPDATE
export const updateStudent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const data = await studentService.updateStudentService(id, req.body);

        if (!data) return errorResponse(res, 'Student not found', 404);

        return successResponse(res, data, 'Updated');
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await studentService.deleteStudentService(id);

        if (!deleted) return errorResponse(res, 'Student not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};