import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

// CREATE
export const createAttendance = async (data: any) => {
    const id = uuid();
    const now = new Date();

    await db.query(
        `INSERT INTO attendance 
        (id, date, status, note, studentId, classId, academicYear, markedBy, markedAt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            data.date,
            data.status,
            data.note || null,
            data.studentId,
            data.classId,
            data.academicYear,
            data.markedBy,
            now,
            now,
            now
        ]
    );

    return { id, ...data };
};

// GET ALL (ENRICHI)
export const findAttendance = async () => {
    const [rows]: any = await db.query(
        `SELECT 
            a.*,

            -- Student
            CONCAT(us.firstName,' ',us.lastName) AS studentName,

            -- Class
            c.name AS className,

            -- School
            sch.name AS schoolName,

            -- Marked By
            CONCAT(um.firstName,' ',um.lastName) AS markedByName,

            -- Justification
            j.id AS justificationId,
            j.reason,
            j.documentUrl,
            j.status AS justificationStatus

        FROM attendance a

        JOIN students s ON a.studentId = s.id
        JOIN users us ON s.userId = us.id

        JOIN classes c ON a.classId = c.id
        JOIN schools sch ON c.schoolId = sch.id

        JOIN users um ON a.markedBy = um.id

        LEFT JOIN absence_justifications j 
            ON j.attendanceId = a.id
            AND a.status IN ('ABSENT', 'LATE')`
    );

    return rows.map((row: any) => ({
        ...row,
        justification:
            row.justificationId
                ? {
                      id: row.justificationId,
                      reason: row.reason,
                      documentUrl: row.documentUrl,
                      status: row.justificationStatus
                  }
                : null
    }));
};

// GET BY CLASS + DATE
export const findByClassAndDate = async (classId: string, date: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM attendance 
         WHERE classId = ? AND date = ?`,
        [classId, date]
    );

    return rows;
};

export const findBySchool = async (schoolId: string) => {
    const [rows]: any = await db.query(
        `SELECT a.*,
            CONCAT(us.firstName,' ',us.lastName) AS studentName,
            c.name AS className,
            sch.name AS schoolName,
            CONCAT(um.firstName,' ',um.lastName) AS markedByName

         FROM attendance a
         JOIN students s ON a.studentId = s.id
         JOIN users us ON s.userId = us.id
         JOIN classes c ON a.classId = c.id
         JOIN schools sch ON c.schoolId = sch.id
         JOIN users um ON a.markedBy = um.id

         WHERE sch.id = ?`,
        [schoolId]
    );

    return rows;
};

export const findByClass = async (classId: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM attendance WHERE classId = ?`,
        [classId]
    );

    return rows;
};

export const findByDate = async (date: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM attendance WHERE date = ?`,
        [date]
    );

    return rows;
};

export const findByAcademicYear = async (year: string) => {
    const [rows]: any = await db.query(
        `SELECT * FROM attendance WHERE academicYear = ?`,
        [year]
    );

    return rows;
};

export const findByStudent = async (
    studentId: string,
    filters?: {
        date?: string;
        academicYear?: string;
    }
) => {
    let query = `
        SELECT 
            a.*,

            CONCAT(us.firstName,' ',us.lastName) AS studentName,
            c.name AS className,
            sch.name AS schoolName,
            CONCAT(um.firstName,' ',um.lastName) AS markedByName

        FROM attendance a

        JOIN students s ON a.studentId = s.id
        JOIN users us ON s.userId = us.id

        JOIN classes c ON a.classId = c.id
        JOIN schools sch ON c.schoolId = sch.id

        JOIN users um ON a.markedBy = um.id

        WHERE a.studentId = ?
    `;

    const values: any[] = [studentId];

    if (filters?.date) {
        query += ' AND DATE(a.date) = ?';
        values.push(filters.date);
    }

    if (filters?.academicYear) {
        query += ' AND a.academicYear = ?';
        values.push(filters.academicYear);
    }

    query += ' ORDER BY a.date DESC';

    const [rows]: any = await db.query(query, values);

    return rows;
};

export const findWithFilters = async (filters: any) => {
    let query = `
        SELECT 
            a.*,
            CONCAT(us.firstName,' ',us.lastName) AS studentName,
            c.name AS className,
            sch.name AS schoolName,
            CONCAT(um.firstName,' ',um.lastName) AS markedByName

        FROM attendance a
        JOIN students s ON a.studentId = s.id
        JOIN users us ON s.userId = us.id
        JOIN classes c ON a.classId = c.id
        JOIN schools sch ON c.schoolId = sch.id
        JOIN users um ON a.markedBy = um.id
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.schoolId) {
        conditions.push('sch.id = ?');
        values.push(filters.schoolId);
    }

    if (filters.classId) {
        conditions.push('a.classId = ?');
        values.push(filters.classId);
    }

    if (filters.academicYear) {
        conditions.push('a.academicYear = ?');
        values.push(filters.academicYear);
    }

    if (filters.date) {
        conditions.push('DATE(a.date) = ?');
        values.push(filters.date);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.date DESC';

    const [rows]: any = await db.query(query, values);

    return rows;
};

// UPDATE
export const updateAttendance = async (id: string, data: any) => {
    const now = new Date();

    await db.query(
        `UPDATE attendance 
         SET status = COALESCE(?, status),
             note = COALESCE(?, note),
             updated_at = ?
         WHERE id = ?`,
        [data.status, data.note, now, id]
    );

    return true;
};

// DELETE
export const deleteAttendance = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM attendance WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};