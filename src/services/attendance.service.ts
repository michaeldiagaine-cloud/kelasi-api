import * as repo from '../repositories/attendance.repository.js';

// CREATE (ANTI-DOUBLON)
export const createAttendanceService = async (data: any) => {
    // vérifier doublon
    const existing = await repo.findByClassAndDate(
        data.classId,
        data.date
    );

    const already = existing.find(
        (a: any) => a.studentId === data.studentId
    );

    if (already) {
        throw new Error('Attendance already marked for this student');
    }

    return repo.createAttendance(data);
};

// GET ALL
export const getAttendanceService = async () => {
    return repo.findAttendance();
};

export const getBySchoolService = (schoolId: string) =>
    repo.findBySchool(schoolId);

export const getByClassService = (classId: string) =>
    repo.findByClass(classId);

export const getByDateService = (date: string) =>
    repo.findByDate(date);

export const getByYearService = (year: string) =>
    repo.findByAcademicYear(year);

export const getByStudentService = async (
    studentId: string,
    filters: any
) => {
    return repo.findByStudent(studentId, filters);
};

export const getAttendanceWithFiltersService = async (filters: any) => {
    return repo.findWithFilters(filters);
};

// UPDATE
export const updateAttendanceService = async (id: string, data: any) => {
    return repo.updateAttendance(id, data);
};

// DELETE
export const deleteAttendanceService = async (id: string) => {
    return repo.deleteAttendance(id);
};