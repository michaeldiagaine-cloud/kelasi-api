import { db } from '../config/db.js';

// CREATE
export const createHomework = async (data: any) => {
    await db.query(
        `INSERT INTO homeworks 
        (id, title, description, subject, dueDate, attachments, classId, teacherId, academicYear, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
            data.id,
            data.title,
            data.description,
            data.subject,
            data.dueDate,
            JSON.stringify(data.attachments || []),
            data.classId,
            data.teacherId,
            data.academicYear
        ]
    );

    return data;
};

// GET ALL
export const findHomeworks = async () => {
    const [rows]: any = await db.query(`SELECT * FROM homeworks`);
    return rows;
};

// GET BY CLASSES (IMPORTANT)
export const findByClasses = async (classIds: string[]) => {
    const [rows]: any = await db.query(
        `SELECT 
            h.*,
            c.name AS className,
            CONCAT(u.firstName,' ',u.lastName) AS teacherName

         FROM homeworks h
         JOIN classes c ON h.classId = c.id
         JOIN users u ON h.teacherId = u.id

         WHERE h.classId IN (?)
         ORDER BY h.dueDate ASC`,
        [classIds]
    );

    return rows;
};

export const findWithFilters = async (filters: any) => {
    let query = `
        SELECT 
            h.*,
            c.name AS className,
            sch.name AS schoolName,
            CONCAT(u.firstName,' ',u.lastName) AS teacherName

        FROM homeworks h
        JOIN classes c ON h.classId = c.id
        JOIN schools sch ON c.schoolId = sch.id
        JOIN users u ON h.teacherId = u.id

        WHERE 1=1
    `;

    const values: any[] = [];

    if (filters.schoolId) {
        query += ` AND sch.id = ?`;
        values.push(filters.schoolId);
    }

    if (filters.classId) {
        query += ` AND h.classId = ?`;
        values.push(filters.classId);
    }

    if (filters.academicYear) {
        query += ` AND h.academicYear = ?`;
        values.push(filters.academicYear);
    }

    if (filters.date) {
        query += ` AND DATE(h.dueDate) = ?`;
        values.push(filters.date);
    }

    query += ` ORDER BY h.dueDate ASC`;

    const [rows]: any = await db.query(query, values);

    return rows;
};


// UPDATE
export const updateHomework = async (id: string, data: any) => {
    await db.query(
        `UPDATE homeworks SET
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            subject = COALESCE(?, subject),
            dueDate = COALESCE(?, dueDate),
            attachments = COALESCE(?, attachments),
            updated_at = NOW()
        WHERE id = ?`,
        [
            data.title,
            data.description,
            data.subject,
            data.dueDate,
            data.attachments ? JSON.stringify(data.attachments) : null,
            id
        ]
    );

    return true;
};

// DELETE
export const deleteHomework = async (id: string) => {
    const [result]: any = await db.query(
        `DELETE FROM homeworks WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
};