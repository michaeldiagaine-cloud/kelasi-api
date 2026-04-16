export interface CreateTeacherAssignmentDto {
    teacherId: string;
    classId: string;
    subject: string;
    academicYear: string;
}

export interface UpdateTeacherAssignmentDto {
    subject?: string;
    academicYear?: string;
}