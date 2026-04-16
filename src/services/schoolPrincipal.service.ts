import * as repo from '../repositories/schoolPrincipal.repository.js';
import type { CreateSchoolPrincipalDto } from '../dtos/schoolPrincipal.dto.js';

// CREATE
export const createPrincipalService = async (
    data: CreateSchoolPrincipalDto
) => {
    // règle métier : un seul directeur actif par école
    if (data.isActive !== false) {
        const existing = await repo.findBySchool(data.schoolId);

        const active = existing.find((p: any) => p.isActive);

        if (active) {
            throw new Error('This school already has an active principal');
        }
    }

    return repo.createPrincipal({
        ...data,
        isActive: data.isActive ?? true
    });
};

// GET ALL
export const getPrincipalsService = async () => {
    return repo.findPrincipals();
};

// GET BY SCHOOL
export const getBySchoolService = async (schoolId: string) => {
    return repo.findBySchool(schoolId);
};

// UPDATE
export const updatePrincipalService = async (id: string, data: any) => {
    return repo.updatePrincipal(id, data);
};

// DELETE
export const deletePrincipalService = async (id: string) => {
    return repo.deletePrincipal(id);
};