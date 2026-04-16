export interface CreateStudentClassDto {
    studentId: string;
    classId: string;
    academicYear: string;
    isActive?: boolean;
}

export interface UpdateStudentClassDto {
    classId?: string;
    academicYear?: string;
    isActive?: boolean;
}