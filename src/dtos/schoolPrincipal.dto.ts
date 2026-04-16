export interface CreateSchoolPrincipalDto {
    userId: string;
    schoolId: string;
    startDate: string;
    isActive?: boolean;
}

export interface UpdateSchoolPrincipalDto {
    isActive?: boolean;
    endDate?: string | null;
}