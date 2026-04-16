// src/dtos/student.dto.ts
export interface CreateStudentDto {
    userId: string;
    studentCode: string;
}

export interface UpdateStudentDto {
    studentCode?: string;
}