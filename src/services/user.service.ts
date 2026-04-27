// src/services/user.service.ts

import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import type {
    CreateUserDto,
    UpdateUserDto
} from '../dtos/user.dto.js';
import * as userRepo from '../repositories/user.repository.js';

// CREATE
export const createUserService = async (
    body: CreateUserDto
) => {
    // règle métier :
    // sauf SUPER_ADMIN,
    // chaque user doit appartenir
    // à une école

    if (
        body.role !== 'SUPER_ADMIN' &&
        !body.schoolId
    ) {
        throw new Error(
            'School is required'
        );
    }

    const id = uuid();

    const passwordHash =
        await bcrypt.hash(
            body.password,
            10
        );

    return await userRepo.insertUser({
        id,
        email: body.email,
        passwordHash,
        firstname: body.firstname,
        lastname: body.lastname,
        role: body.role,
        schoolId: body.schoolId || null
    });
};

// GET ALL
export const getUsersService = async () => {
    return await userRepo.findAllUsers();
};

// GET BY ID
export const getUserByIdService = async (
    id: string
) => {
    return await userRepo.findUserById(id);
};

// GET BY SCHOOL
export const getUsersBySchoolService =
    async (schoolId: string) => {
        return await userRepo.findUsersBySchool(
            schoolId
        );
    };

// UPDATE
export const updateUserService = async (
    id: string,
    data: UpdateUserDto
) => {
    return await userRepo.updateUserById(
        id,
        data
    );
};

// DELETE
export const deleteUserService = async (
    id: string
) => {
    return await userRepo.deleteUserById(
        id
    );
};