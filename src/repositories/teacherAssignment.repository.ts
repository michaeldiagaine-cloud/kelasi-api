import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createTeacherAssignment = async (data: {
    teacherId: string;
    classId: string;
    subject: string;
    academicYear: string;
}) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO teacher_assignments
        (id, teacherId, classId, subject, academicYear, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            data.teacherId,
            data.classId,
            data.subject,
            data.academicYear,
            now,
            now
        ]
    );

    return { id, ...data };
};

// GET ALL (ENRICHI)
export const findTeacherAssignments = async () => {
    const [rows]: any = await db.query(
        `SELECT 
            ta.*,

            -- Teacher
            CONCAT(u.firstName, ' ', u.lastName) AS teacherName,

            -- Class
            c.name AS className,
            c.level AS classLevel,

            -- School
            s.name AS schoolName

         FROM teacher_assignments ta
         JOIN users u ON ta.teacherId = u.id
         JOIN classes c ON ta.classId = c.id
         JOIN schools s ON c.schoolId = s.id`
    );

    return rows;
};

// GET BY TEACHER
export const findByTeacher = async (teacherId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            ta.*,
            c.name AS className,
            ta.subject
         FROM teacher_assignments ta
         JOIN classes c ON ta.classId = c.id
         WHERE ta.teacherId = ?`,
        [teacherId]
    );

    return rows;
};

// GET BY CLASS
export const findByClass = async (classId: string) => {
    const [rows]: any = await db.query(
        `SELECT 
            ta.*,
            CONCAT(u.firstName, ' ', u.lastName) AS teacherName
         FROM teacher_assignments ta
         JOIN users u ON ta.teacherId = u.id
         WHERE ta.classId = ?`,
        [classId]
    );

    return rows;
};

// DELETE
export const deleteTeacherAssignment = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM teacher_assignments WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};