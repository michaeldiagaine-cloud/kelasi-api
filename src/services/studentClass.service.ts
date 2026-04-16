import * as repo from '../repositories/studentClass.repository.js';
import type {
    CreateStudentClassDto,
    UpdateStudentClassDto
} from '../dtos/studentClass.dto.js';

// CREATE
export const createStudentClassService = async (
    data: CreateStudentClassDto
) => {
    // règle métier : une seule classe active
    if (data.isActive) {
        const existing = await repo.findByStudent(data.studentId);

        const active = existing.find((c: any) => c.isActive);

        if (active) {
            throw new Error('Student already has an active class');
        }
    }

    return repo.createStudentClass({
        ...data,
        isActive: data.isActive ?? true
    });
};

// GET ALL
export const getByClassService = async (classId: string) => {
    return repo.findByClass(classId);
};

// GET BY 
export const getBySchoolService = async (schoolId: string) => {
    return repo.findBySchool(schoolId);
};

// GET BY ID
export const getStudentClassByIdService = async (id: string) => {
    return repo.findStudentClassById(id);
};

// GET BY STUDENT
export const getByStudentService = async (studentId: string) => {
    return repo.findByStudent(studentId);
};

// UPDATE
export const updateStudentClassService = async (
    id: string,
    data: UpdateStudentClassDto
) => {
    const exists = await repo.findStudentClassById(id);
    if (!exists) return null;

    return repo.updateStudentClass(id, data);
};

// DELETE
export const deleteStudentClassService = async (id: string) => {
    return repo.deleteStudentClass(id);
};