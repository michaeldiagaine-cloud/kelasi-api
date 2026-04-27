export type UserRole =
    | 'SUPER_ADMIN'
    | 'DIRECTION'
    | 'TEACHER'
    | 'PARENT'
    | 'STUDENT';

export interface CreateUserDto {
    email: string;
    password: string; // ⚠️ password brut (service va hash)
    firstname: string;
    lastname: string;
    role: UserRole;
    schoolId?: string | null;
}

export interface UpdateUserDto {
    email?: string;
    firstname?: string;
    lastname?: string;
    role?: UserRole;
    schoolId?: string | null;
}