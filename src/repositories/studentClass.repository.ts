import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createStudentClass = async (data: {
    studentId: string;
    classId: string;
    academicYear: string;
    isActive: boolean;
}) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO student_classes 
        (id, studentId, classId, academicYear, isActive, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            data.studentId,
            data.classId,
            data.academicYear,
            data.isActive,
            now,
            now
        ]
    );

    return { id, ...data };
};

// GET ALL
export const findStudentClasses = async () => {
    const [rows]: any = await db.query(
        `SELECT 
            sc.id,
            sc.academicYear,
            sc.isActive,

            sc.studentId,
            sc.classId,

            -- Student
            s.studentCode,
            u.firstName,
            u.lastName,
            CONCAT(u.firstName, ' ', u.lastName) AS studentName,

            -- Class
            c.name AS className,
            c.level AS classLevel,

            -- School
            sch.id AS schoolId,
            sch.name AS schoolName

         FROM student_classes sc
         JOIN students s ON sc.studentId = s.id
         JOIN users u ON s.userId = u.id
         JOIN classes c ON sc.classId = c.id
         JOIN schools sch ON c.schoolId = sch.id`
    );

    return rows;
};

// GET BY ID
export const findStudentClassById = async (id: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM student_classes WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
};

// GET BY STUDENT
export const findByStudent = async (studentId: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM student_classes WHERE studentId = ?`,
        [studentId]
    );

    return rows;
};

// UPDATE
export const updateStudentClass = async (id: string, data: any) => {
    const now = new Date();

    await db.query(
        `UPDATE student_classes 
         SET classId = COALESCE(?, classId),
             academicYear = COALESCE(?, academicYear),
             isActive = COALESCE(?, isActive),
             updated_at = ?
         WHERE id = ?`,
        [
            data.classId,
            data.academicYear,
            data.isActive,
            now,
            id
        ]
    );

    return findStudentClassById(id);
};

// DELETE
export const deleteStudentClass = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM student_classes WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};

export const findByClass = async (classId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            sc.*,
            CONCAT(u.firstName, ' ', u.lastName) AS studentName,
            c.name AS className,
            sch.name AS schoolName

         FROM student_classes sc
         JOIN students s ON sc.studentId = s.id
         JOIN users u ON s.userId = u.id
         JOIN classes c ON sc.classId = c.id
         JOIN schools sch ON c.schoolId = sch.id
         WHERE sc.classId = ?`,
        [classId]
    );

    return rows;
};

export const findBySchool = async (schoolId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            sc.*,
            CONCAT(u.firstName, ' ', u.lastName) AS studentName,
            c.name AS className,
            sch.name AS schoolName

         FROM student_classes sc
         JOIN students s ON sc.studentId = s.id
         JOIN users u ON s.userId = u.id
         JOIN classes c ON sc.classId = c.id
         JOIN schools sch ON c.schoolId = sch.id
         WHERE sch.id = ?`,
        [schoolId]
    );

    return rows;
};