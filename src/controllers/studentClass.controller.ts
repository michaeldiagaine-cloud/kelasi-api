import type { Request, Response } from 'express';
import * as service from '../services/studentClass.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createStudentClass = async (req: Request, res: Response) => {
    try {
        const { studentId, classId, academicYear } = req.body;

        if (!studentId || !classId || !academicYear) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        const data = await service.createStudentClassService(req.body);

        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// GET ALL
export const getStudentClasses = async (_: Request, res: Response) => {
    try {
        const data = await service.getByClassService;
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY ID
export const getStudentClassById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const data = await service.getStudentClassByIdService(id);

        if (!data) return errorResponse(res, 'Not found', 404);

        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY STUDENT
export const getByStudent = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId as string;

        const data = await service.getByStudentService(studentId);

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

// GET BY SCHOOL
export const getBySchool = async (req: Request, res: Response) => {
    try {
        const schoolId = req.params.schoolId as string;

        const data = await service.getBySchoolService(schoolId);

        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// UPDATE
export const updateStudentClass = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const data = await service.updateStudentClassService(id, req.body);

        if (!data) return errorResponse(res, 'Not found', 404);

        return successResponse(res, data, 'Updated');
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteStudentClass = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await service.deleteStudentClassService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};