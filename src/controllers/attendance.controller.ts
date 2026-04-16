import type { Request, Response } from 'express';
import * as service from '../services/attendance.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// CREATE
export const createAttendance = async (req: Request, res: Response) => {
    try {
        const data = await service.createAttendanceService(req.body);
        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
};

// GET ALL
export const getAttendance = async (_: Request, res: Response) => {
    try {
        const data = await service.getAttendanceService();
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

export const getBySchool = async (req: Request, res: Response) => {
    const schoolId = req.params.schoolId as string;
    const data = await service.getBySchoolService(schoolId);
    return successResponse(res, data);
};

export const getByClass = async (req: Request, res: Response) => {
    const classId = req.params.classId as string;
    const data = await service.getByClassService(classId);
    return successResponse(res, data);
};

export const getByDate = async (req: Request, res: Response) => {
    const date = req.params.date as string;
    const data = await service.getByDateService(date);
    return successResponse(res, data);
};

export const getByYear = async (req: Request, res: Response) => {
    const year = req.params.year as string;
    const data = await service.getByYearService(year);
    return successResponse(res, data);
};

export const getByStudent = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId as string;

        const filters = {
            date: Array.isArray(req.query.date)
                ? req.query.date[0]
                : req.query.date,
            academicYear: Array.isArray(req.query.academicYear)
                ? req.query.academicYear[0]
                : req.query.academicYear
        };

        const data = await service.getByStudentService(studentId, filters);

        return successResponse(res, data);
    } catch (err: any) {
        console.error('getByStudent ERROR:', err);
        return errorResponse(res, err.message || 'Erreur serveur');
    }
};

export const getAttendanceWithFilters = async (req: Request, res: Response) => {
    try {
        const filters = {
            schoolId: req.query.schoolId as string,
            classId: req.query.classId as string,
            academicYear: req.query.academicYear as string,
            date: req.query.date as string
        };

        const data = await service.getAttendanceWithFiltersService(filters);

        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// UPDATE
export const updateAttendance = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        await service.updateAttendanceService(id, req.body);

        return successResponse(res, null, 'Updated');
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteAttendance = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await service.deleteAttendanceService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};