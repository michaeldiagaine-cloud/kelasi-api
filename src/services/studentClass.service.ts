// src/services/studentClass.service.ts

import * as repo from '../repositories/studentClass.repository.js';
import type {
    CreateStudentClassDto,
    UpdateStudentClassDto
} from '../dtos/studentClass.dto.js';

// CREATE
export const createStudentClassService = async (
    data: CreateStudentClassDto
) => {
    // règle métier :
    // un élève ne peut avoir
    // qu'une seule classe active

    if (data.isActive !== false) {
        const existing = await repo.findByStudent(
            data.studentId
        );

        const active = existing.find(
            (c: any) => c.isActive === true
        );

        if (active) {
            throw new Error(
                'Student already has an active class'
            );
        }
    }

    return await repo.createStudentClass({
        ...data,
        isActive: data.isActive ?? true
    });
};

// GET ALL
export const getStudentClassesService = async () => {
    return await repo.findStudentClasses();
};

// GET BY ID
export const getStudentClassByIdService = async (
    id: string
) => {
    return await repo.findStudentClassById(id);
};

// GET BY STUDENT
export const getByStudentService = async (
    studentId: string
) => {
    return await repo.findByStudent(studentId);
};

// GET BY CLASS
export const getByClassService = async (
    classId: string
) => {
    return await repo.findByClass(classId);
};

// GET BY SCHOOL
export const getBySchoolService = async (
    schoolId: string
) => {
    return await repo.findBySchool(schoolId);
};

// UPDATE
export const updateStudentClassService = async (
    id: string,
    data: UpdateStudentClassDto
) => {
    const exists =
        await repo.findStudentClassById(id);

    if (!exists) {
        return null;
    }

    return await repo.updateStudentClass(
        id,
        data
    );
};

// DELETE
export const deleteStudentClassService = async (
    id: string
) => {
    return await repo.deleteStudentClass(id);
};