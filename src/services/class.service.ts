// src/services/class.service.ts

import { randomUUID } from 'crypto';
import type {
    CreateClassDto,
    UpdateClassDto
} from '../dtos/class.dto.js';

import {
    createClass,
    findClasses,
    findClassById,
    findClassesBySchool,
    updateClass,
    deleteClass
} from '../repositories/class.repository.js';

// CREATE
export const createClassService = async (
    data: CreateClassDto
) => {
    const id = randomUUID();

    // vérifier si une classe avec le même nom existe déjà
    const existing = await findClassesBySchool(data.schoolId);

    if (
        existing.some(
            (c: { name: string }) =>
                c.name.toLowerCase() === data.name.toLowerCase()
        )
    ) {
        throw new Error(
            'Class already exists in this school'
        );
    }

    const classToCreate = {
        id,
        name: data.name,
        level: data.level,
        schoolId: data.schoolId
    };

    await createClass(classToCreate);

    return classToCreate;
};

// GET ALL
export const getClassesService = async () => {
    return await findClasses();
};

// GET BY ID
export const getClassByIdService = async (
    id: string
) => {
    return await findClassById(id);
};

// GET BY SCHOOL
export const getClassesBySchoolService = async (
    schoolId: string
) => {
    return await findClassesBySchool(schoolId);
};

// UPDATE
export const updateClassService = async (
    id: string,
    data: UpdateClassDto
) => {
    const exists = await findClassById(id);

    if (!exists) {
        return null;
    }

    await updateClass(id, data);

    return {
        id,
        ...data
    };
};

// DELETE
export const deleteClassService = async (
    id: string
) => {
    return await deleteClass(id);
};

// ```json
// {
//   "status": "success",
//   "message": "Deleted"
// }
// ```