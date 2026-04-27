// src/services/school.service.ts

import {
    createSchoolRepo,
    getSchoolsRepo,
    getSchoolByIdRepo,
    updateSchoolRepo,
    deleteSchoolRepo
} from '../repositories/school.repository.js';

export const createSchoolService = async (data: {
    id: string;
    name: string;
    code: string;
}) => {
    // 🔥 Vérification métier possible ici
    // exemple : vérifier si le code existe déjà

    return await createSchoolRepo(data);
};

export const getSchoolsService = async () => {
    return await getSchoolsRepo();
};

export const getSchoolByIdService = async (id: string) => {
    return await getSchoolByIdRepo(id);
};

export const updateSchoolService = async (
    id: string,
    data: {
        name?: string;
        code?: string;
    }
) => {
    // 🔥 Vérifier si l’école existe
    const exists = await getSchoolByIdRepo(id);

    if (!exists) {
        return null;
    }

    const updated = await updateSchoolRepo(id, data);

    if (!updated) {
        return null;
    }

    return {
        id,
        ...data
    };
};

export const deleteSchoolService = async (id: string) => {
    return await deleteSchoolRepo(id);
};