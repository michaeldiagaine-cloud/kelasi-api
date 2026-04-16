import type { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import type { CreateUserDto, UpdateUserDto } from '../dtos/user.dto.js';
import * as userService from '../services/user.service.js';

// CREATE
export const createUser = async (req: Request, res: Response) => {
    const body: CreateUserDto = req.body;

    if (!body.email || !body.password || !body.firstName || !body.lastName) {
        return errorResponse(res, 'Champs requis manquants', 400);
    }

    try {
        const data = await userService.createUserService(body);
        return successResponse(res, data, 'User created successfully', 201);
    } catch (err: any) {
        console.error(err);
        return errorResponse(res, err.message || 'Erreur serveur');
    }
};

// GET ALL
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const data = await userService.getUsersService();
        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const data = await userService.getUserByIdService(id);

        if (!data) return errorResponse(res, 'User not found', 404);

        return successResponse(res, data);
    } catch {
        return errorResponse(res);
    }
};

// GET BY SCHOOL
export const getUsersBySchool = async (req: Request, res: Response) => {
    try {
        const schoolId = req.params.schoolId as string;

        const users = await userService.getUsersBySchoolService(schoolId);

        if (!users || users.length === 0) {
            return errorResponse(res, 'No users found for this school', 404);
        }

        return successResponse(res, users);
    } catch {
        return errorResponse(res);
    }
};

// UPDATE
export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const body: UpdateUserDto = req.body;

        const data = await userService.updateUserService(id, body);

        if (!data) return errorResponse(res, 'User not found', 404);

        return successResponse(res, data, 'Updated');
    } catch {
        return errorResponse(res);
    }
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await userService.deleteUserService(id);

        if (!deleted) return errorResponse(res, 'User not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch {
        return errorResponse(res);
    }
};