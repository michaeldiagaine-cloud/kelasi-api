// src/dtos/school.dto.ts

export interface CreateSchoolDto {
    name: string;
    code: string;
}

export interface UpdateSchoolDto {
    name?: string; // optionnel pour ne mettre à jour que ce qui change
    code?: string; // idem
    status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL'; // si tu veux permettre la mise à jour du status
}