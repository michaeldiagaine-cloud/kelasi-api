// src/services/schoolPrincipal.service.ts

import * as repo from '../repositories/schoolPrincipal.repository.js';
import type {
    CreateSchoolPrincipalDto
} from '../dtos/schoolPrincipal.dto.js';

// CREATE
export const createPrincipalService = async (
    data: CreateSchoolPrincipalDto
) => {
    // règle métier :
    // une seule direction active par école

    if (data.isActive !== false) {
        const existing = await repo.findBySchool(
            data.schoolId
        );

        const active = existing.find(
            (p: any) => p.isActive === true
        );

        if (active) {
            throw new Error(
                'This school already has an active principal'
            );
        }
    }

    return await repo.createPrincipal({
        ...data,
        isActive: data.isActive ?? true
    });
};

// GET ALL
export const getPrincipalsService = async () => {
    return await repo.findPrincipals();
};

// GET BY SCHOOL
export const getBySchoolService = async (
    schoolId: string
) => {
    return await repo.findBySchool(schoolId);
};

// UPDATE
export const updatePrincipalService = async (
    id: string,
    data: any
) => {
    return await repo.updatePrincipal(id, data);
};

// DELETE
export const deletePrincipalService = async (
    id: string
) => {
    return await repo.deletePrincipal(id);
};