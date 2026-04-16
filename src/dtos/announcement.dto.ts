export interface CreateAnnouncementDto {
    title: string;
    content: string;
    isPinned?: boolean;
    attachments?: string[];

    schoolId: string;
    classId?: string;
    studentId?: string;

    createdBy: string;
}

export interface UpdateAnnouncementDto {
    title?: string;
    content?: string;
    isPinned?: boolean;
    attachments?: string[];
}