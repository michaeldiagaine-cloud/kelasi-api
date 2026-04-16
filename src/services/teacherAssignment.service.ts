import type { CreateTeacherAssignmentDto } from '../dtos/teacherAssignment.dto.js';
import * as repo from '../repositories/teacherAssignment.repository.js';

// CREATE
export const createTeacherAssignmentService = async (
    data: CreateTeacherAssignmentDto
) => {
    return repo.createTeacherAssignment(data);
};

// GET ALL
export const getTeacherAssignmentsService = async () => {
    return repo.findTeacherAssignments();
};

// GET BY TEACHER
export const getByTeacherService = async (teacherId: string) => {
    return repo.findByTeacher(teacherId);
};

// GET BY CLASS
export const getByClassService = async (classId: string) => {
    return repo.findByClass(classId);
};

// DELETE
export const deleteTeacherAssignmentService = async (id: string) => {
    return repo.deleteTeacherAssignment(id);
};