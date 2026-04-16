import { db } from '../config/db.js';

// CREATE
export const createReport = async (data: any) => {
    await db.query(
        `INSERT INTO discipline_reports 
        (id, title, description, level, actionTaken, date, studentId, principalId, academicYear, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
            data.id,
            data.title,
            data.description,
            data.level,
            data.actionTaken || null,
            data.date,
            data.studentId,
            data.principalId,
            data.academicYear
        ]
    );

    return data;
};

// 🔥 FIND WITH FILTERS + ENRICHI
export const findReports = async (filters: any) => {
    let query = `
        SELECT 
            d.*,

            CONCAT(us.firstName,' ',us.lastName) AS studentName,
            CONCAT(up.firstName,' ',up.lastName) AS principalName,

            c.name AS className,
            sch.name AS schoolName

        FROM discipline_reports d

        JOIN students s ON d.studentId = s.id
        JOIN users us ON s.userId = us.id

        JOIN users up ON d.principalId = up.id

        JOIN student_classes sc ON sc.studentId = s.id AND sc.isActive = 1
        JOIN classes c ON sc.classId = c.id
        JOIN schools sch ON c.schoolId = sch.id

        WHERE 1=1
    `;

    const values: any[] = [];

    if (filters.schoolId) {
        query += ` AND sch.id = ?`;
        values.push(filters.schoolId);
    }

    if (filters.classId) {
        query += ` AND c.id = ?`;
        values.push(filters.classId);
    }

    if (filters.studentId) {
        query += ` AND d.studentId = ?`;
        values.push(filters.studentId);
    }

    if (filters.level) {
        query += ` AND d.level = ?`;
        values.push(filters.level);
    }

    if (filters.academicYear) {
        query += ` AND d.academicYear = ?`;
        values.push(filters.academicYear);
    }

    if (filters.date) {
        query += ` AND d.date = ?`; // 🔥 corrigé
        values.push(filters.date);
    }

    query += ` ORDER BY d.date DESC`;

    const [rows]: any = await db.query(query, values);

    return rows;
};

// DELETE
export const deleteReport = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM discipline_reports WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};