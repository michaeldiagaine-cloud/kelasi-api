// src/services/attendance.service.ts

import * as repo from '../repositories/attendance.repository.js';

// CREATE (ANTI-DOUBLON)
export const createAttendanceService = async (
    data: any
) => {
    const existing =
        await repo.findByClassAndDate(
            data.classId,
            data.date
        );

    const already = existing.find(
        (a: any) =>
            a.studentId === data.studentId ||
            a.studentId === data.studentId
    );

    if (already) {
        throw new Error(
            'Attendance already marked for this student'
        );
    }

    return await repo.createAttendance(data);
};

// GET ALL
export const getAttendanceService = async () => {
    return await repo.findAttendance();
};

// GET BY SCHOOL
export const getBySchoolService = async (
    schoolId: string
) => {
    return await repo.findBySchool(schoolId);
};

// GET BY CLASS
export const getByClassService = async (
    classId: string
) => {
    return await repo.findByClass(classId);
};

// GET BY DATE
export const getByDateService = async (
    date: string
) => {
    return await repo.findByDate(date);
};

// GET BY YEAR
export const getByYearService = async (
    year: string
) => {
    return await repo.findByAcademicYear(year);
};

// GET BY STUDENT
export const getByStudentService = async (
    studentId: string,
    filters: any
) => {
    return await repo.findByStudent(
        studentId,
        filters
    );
};

// FILTERS
export const getAttendanceWithFiltersService =
    async (filters: any) => {
        return await repo.findWithFilters(
            filters
        );
    };

// UPDATE
export const updateAttendanceService = async (
    id: string,
    data: any
) => {
    return await repo.updateAttendance(
        id,
        data
    );
};

// DELETE
export const deleteAttendanceService = async (
    id: string
) => {
    return await repo.deleteAttendance(id);
};