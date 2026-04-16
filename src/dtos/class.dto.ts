export interface CreateClassDto {
    // id: string;
    name: string;
    level: string;
    schoolId: string;
}

export interface UpdateClassDto {
    name?: string;
    level?: string;
    schoolId?: string;
}