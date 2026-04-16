// attendance.dto.ts

export interface CreateAttendanceDto {
    studentId: string;
    classId: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    note?: string;
    academicYear: string;
    markedBy: string;
}

export interface UpdateAttendanceDto {
    status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    note?: string;
}