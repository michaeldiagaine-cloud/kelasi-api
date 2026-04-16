import type { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import type { CreateSchoolDto, UpdateSchoolDto } from '../dtos/school.dto.js';

import {
    createSchoolService,
    getSchoolsService,
    getSchoolByIdService,
    updateSchoolService,
    deleteSchoolService
} from '../services/school.service.js';


// CREATE
export const createSchool = async (req: Request, res: Response) => {
    const body: CreateSchoolDto = req.body;

    if (!body?.name || !body?.code) {
        return errorResponse(res, 'Le nom et le code sont requis', 400);
    }

    try {
        const school = await createSchoolService({
            id: uuid(),
            name: body.name,
            code: body.code
        });

        return successResponse(res, school, 'School created', 201);
    } catch (err) {
        return errorResponse(res, 'Erreur serveur');
    }
};


// GET ALL
export const getSchools = async (_req: Request, res: Response) => {
    try {
        const data = await getSchoolsService();
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};


// GET BY ID
export const getSchoolById = async (
    req: Request<{ id: string }>, // <-- typage strict du param id
    res: Response
) => {
    try {
        const data = await getSchoolByIdService(req.params.id);

        if (!data) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};


// UPDATE
export const updateSchool = async (
    req: Request<{ id: string }, any, UpdateSchoolDto>, // id en params + body typé
    res: Response
) => {
    try {
        const data = await updateSchoolService(req.params.id, req.body);

        if (!data) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, data, 'Updated');
    } catch {
        return errorResponse(res);
    }
};


// DELETE
export const deleteSchool = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const deleted = await deleteSchoolService(req.params.id);

        if (!deleted) {
            return errorResponse(res, 'School not found', 404);
        }

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};