// src/services/teacherAssignment.service.ts

import * as repo from '../repositories/teacherAssignment.repository.js';
import type {
    CreateTeacherAssignmentDto
} from '../dtos/teacherAssignment.dto.js';

// CREATE
export const createTeacherAssignmentService = async (
    data: CreateTeacherAssignmentDto
) => {
    return await repo.createTeacherAssignment(data);
};

// GET ALL
export const getTeacherAssignmentsService = async () => {
    return await repo.findTeacherAssignments();
};

// GET BY TEACHER
export const getByTeacherService = async (
    teacherId: string
) => {
    return await repo.findByTeacher(teacherId);
};

// GET BY CLASS
export const getByClassService = async (
    classId: string
) => {
    return await repo.findByClass(classId);
};

// DELETE
export const deleteTeacherAssignmentService = async (
    id: string
) => {
    return await repo.deleteTeacherAssignment(id);
};