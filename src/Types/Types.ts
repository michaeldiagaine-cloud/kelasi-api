export type ID = string;
export type AcademicYear = string; // ex: "2025-2026"

export interface BaseEntity {
    id: ID;
    createdAt: string;
    updatedAt: string;
}

// ======================
// USER / SCHOOL
// ======================

export type UserRole =
    | 'SUPER_ADMIN'
    | 'DIRECTION'
    | 'TEACHER'
    | 'PARENT'
    | 'STUDENT';

export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string; 
    role: UserRole;
    schoolId: ID | null;
    avatarUrl: string | null;

    school?: {
        id: ID;
        name: string;
        code: string;
        logoUrl: string | null;
    };
}

export type SchoolStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export interface School extends BaseEntity {
    name: string;
    code: string;
    logoUrl: string | null;
    status: SchoolStatus;
}

// ======================
// CLASS / STUDENT
// ======================

export interface Class extends BaseEntity {
    name: string;
    level: 'NURSERY_SCHOOL' |'PRIMARY' | 'SECONDARY' | 'HIGH_SCHOOL';
    schoolId: ID;
}

// historique des classes
export interface StudentClass extends BaseEntity {
    studentId: ID;
    classId: ID;
    academicYear: AcademicYear;
    isActive: boolean; // classe actuelle ou historique
}

export interface Student extends BaseEntity {
    userId: ID;
    studentCode: string;

    user?: {
        id: ID;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    };
}

// lien parent ↔ enfant
export interface ParentStudent {
    parentId: ID;
    studentId: ID;
}

// ======================
// TEACHER
// ======================

export interface TeacherAssignment {
    teacherId: ID;
    classId: ID;
    subject: string;
    academicYear: AcademicYear;
}

// ======================
// DIRECTION
// ======================

export interface SchoolPrincipal extends BaseEntity {
    userId: ID;
    schoolId: ID;

    isActive: boolean; // directeur actuel ou ancien

    startDate: string;
    endDate?: string | null;
}

// ======================
// ATTENDANCE
// ======================

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface Attendance extends BaseEntity {
    date: string;
    status: AttendanceStatus;
    note: string | null;

    studentId: ID;
    classId: ID;

    academicYear: AcademicYear;

    markedBy: ID; // 🔥 qui a pris la présence
    markedAt: string;

    student?: {
        id: ID;
        user: {
            firstName: string;
            lastName: string;
        };
    };

    markedByUser?: {
        id: ID;
        user: {
            firstName: string;
            lastName: string;
        };
    };

    justification?: AbsenceJustification | null;
}

// ======================
// JUSTIFICATION
// ======================

export type JustificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AbsenceJustification extends BaseEntity {
    reason: string;
    documentUrl: string | null;
    status: JustificationStatus;
    attendanceId: ID;
    reviewedBy?: ID;
}

// ======================
// HOMEWORK
// ======================

export interface Homework extends BaseEntity {
    title: string;
    description: string;
    subject: string;
    dueDate: string;
    attachments: string[];
    classId: ID;
    teacherId: ID;
    academicYear: AcademicYear;

    class?: {
        id: ID;
        name: string;
    };

    teacher?: {
        id: ID;
        user: {
            firstName: string;
            lastName: string;
        };
    };
}

// ======================
// ANNOUNCEMENT
// ======================

export interface Announcement extends BaseEntity {
    title: string;
    content: string;
    isPinned: boolean;
    attachments: string[];

    schoolId: ID;

    classId?: ID | null;
    studentId?: ID | null;

    createdBy: ID; // 🔥 important
    publishedAt: string;

    _count?: {
        reads: number;
    };
}

// ======================
// DISCIPLINE (optionnel mais gardé comme tu voulais)
// ======================

export type DisciplineLevel =
    | 'WARNING'
    | 'OBSERVATION'
    | 'SUSPENSION'
    | 'EXCLUSION';

export interface DisciplineReport extends BaseEntity {
    title: string;
    description: string;
    level: DisciplineLevel;
    actionTaken: string | null;

    studentId: ID;
    principalId: ID;
    academicYear: AcademicYear;
    date: string;

    student?: {
        user: {
            firstName: string;
            lastName: string;
        };
    };

    principal?: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
}