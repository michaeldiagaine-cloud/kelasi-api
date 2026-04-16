import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import type { CreateUserDto, UpdateUserDto } from '../dtos/user.dto.js';
import * as userRepo from '../repositories/user.repository.js';

export const createUserService = async (body: CreateUserDto) => {
    if (body.role !== 'SUPER_ADMIN' && !body.schoolId) {
        throw new Error('School is required');
    }

    const id = uuid();
    const now = new Date();

    const passwordHash = await bcrypt.hash(body.password, 10);

    return userRepo.insertUser({
        id,
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        schoolId: body.schoolId || null,
        createdAt: now,
        updatedAt: now
    });
};

export const getUsersService = async () => {
    return userRepo.findAllUsers();
};

export const getUserByIdService = async (id: string) => {
    return userRepo.findUserById(id);
};

export const getUsersBySchoolService = async (schoolId: string) => {
    return userRepo.findUsersBySchool(schoolId);
};

export const updateUserService = async (id: string, data: UpdateUserDto) => {
    return userRepo.updateUserById(id, data);
};

export const deleteUserService = async (id: string) => {
    return userRepo.deleteUserById(id);
};