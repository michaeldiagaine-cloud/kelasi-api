export interface CreateDisciplineDto {
    title: string;
    description: string;
    level: 'WARNING' | 'OBSERVATION' | 'SUSPENSION' | 'EXCLUSION';
    actionTaken?: string;

    date: string;
    studentId: string;
    academicYear: string;
}

export interface UpdateDisciplineDto {
    title?: string;
    description?: string;
    level?: 'WARNING' | 'OBSERVATION' | 'SUSPENSION' | 'EXCLUSION';
    actionTaken?: string;
}