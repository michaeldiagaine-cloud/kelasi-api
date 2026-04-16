import type { Request, Response, NextFunction } from 'express';
import * as classService from '../services/class.service.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';
import type { CreateClassDto, UpdateClassDto } from '../dtos/class.dto.js';

// CREATE
export const createClass = async (req: Request, res: Response) => {
    try {
        const body: CreateClassDto = req.body;

        // validation minimale
        if (!body.name || !body.level || !body.schoolId) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        const data = await classService.createClassService(body);
        return successResponse(res, data, 'Created', 201);
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

// GET ALL
export const getClasses = async (_: Request, res: Response) => {
    try {
        const data = await classService.getClassesService();
        return successResponse(res, data);
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

// GET BY ID
export const getClassById = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const data = await classService.getClassByIdService(id);

        if (!data) return errorResponse(res, 'Class not found', 404);
        return successResponse(res, data);
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

// GET BY SCHOOL
export const getClassesBySchool = async (req: Request, res: Response) => {
    try {
        const schoolId = Array.isArray(req.params.schoolId) ? req.params.schoolId[0] : req.params.schoolId;

        const data = await classService.getClassesBySchoolService(schoolId);

        return successResponse(res, data);
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

// UPDATE
export const updateClass = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const body: UpdateClassDto = req.body;

        if (!body.name && !body.level && !body.schoolId) {
            return errorResponse(res, 'No fields to update', 400);
        }

        const data = await classService.updateClassService(id, body);

        if (!data) return errorResponse(res, 'Class not found', 404);
        return successResponse(res, data, 'Updated');
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

// DELETE
export const deleteClass = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const deleted = await classService.deleteClassService(id);

        if (!deleted) return errorResponse(res, 'Class not found', 404);
        return successResponse(res, null, 'Deleted');
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};