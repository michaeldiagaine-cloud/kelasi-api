export type UserRole =
    | 'SUPER_ADMIN'
    | 'DIRECTION'
    | 'TEACHER'
    | 'PARENT'
    | 'STUDENT';

export interface CreateUserDto {
    email: string;
    password: string; // ⚠️ password brut (service va hash)
    firstName: string;
    lastName: string;
    role: UserRole;
    schoolId?: string | null;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    schoolId?: string | null;
}