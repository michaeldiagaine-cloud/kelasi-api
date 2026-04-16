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
    // 👉 logique métier possible ici (ex: vérifier unicité)
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
    data: { name?: string; code?: string }
) => {
    const exists = await getSchoolByIdRepo(id);
    if (!exists) return null;

    await updateSchoolRepo(id, data);

    return { id, ...data };
};

export const deleteSchoolService = async (id: string) => {
    return await deleteSchoolRepo(id);
};