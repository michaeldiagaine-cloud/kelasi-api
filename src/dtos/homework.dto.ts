export interface CreateHomeworkDto {
    title: string;
    description: string;
    subject: string;
    dueDate: string;
    attachments?: string[];

    classId: string;
    teacherId: string;
    academicYear: string;
}

export interface UpdateHomeworkDto {
    title?: string;
    description?: string;
    subject?: string;
    dueDate?: string;
    attachments?: string[];

    classId?: string;
    teacherId?: string;
    academicYear?: string;
}