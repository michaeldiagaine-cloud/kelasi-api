// src/services/student.service.ts

import type {
    CreateStudentDto,
    UpdateStudentDto
} from '../dtos/student.dto.js';

import * as studentRepo from '../repositories/student.repository.js';

// CREATE
export const createStudentService = async (
    data: CreateStudentDto
) => {
    return await studentRepo.createStudent(data);
};

// GET ALL
export const getStudentsService = async () => {
    return await studentRepo.findStudents();
};

// GET BY ID
export const getStudentByIdService = async (
    id: string
) => {
    return await studentRepo.findStudentById(id);
};

// UPDATE
export const updateStudentService = async (
    id: string,
    data: UpdateStudentDto
) => {
    const exists = await studentRepo.findStudentById(id);

    if (!exists) {
        return null;
    }

    return await studentRepo.updateStudent(id, data);
};

// DELETE
export const deleteStudentService = async (
    id: string
) => {
    return await studentRepo.deleteStudent(id);
};