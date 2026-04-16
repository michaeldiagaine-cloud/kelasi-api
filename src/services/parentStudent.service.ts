import * as repo from '../repositories/parentStudent.repository.js';
import type { CreateParentStudentDto } from '../dtos/parentStudent.dto.js';

// CREATE
export const createParentStudentService = async (
    data: CreateParentStudentDto
) => {
    return repo.createParentStudent(data);
};

// GET ALL
export const getParentStudentsService = async () => {
    return repo.findParentStudents();
};

// GET BY PARENT
export const getByParentService = async (parentId: string) => {
    return repo.findByParent(parentId);
};

// GET BY STUDENT
export const getByStudentService = async (studentId: string) => {
    return repo.findByStudent(studentId);
};

// DELETE
export const deleteParentStudentService = async (id: string) => {
    return repo.deleteParentStudent(id);
};