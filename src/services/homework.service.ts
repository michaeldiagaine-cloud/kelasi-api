import { v4 as uuid } from 'uuid';
import { db } from '../config/db.js';
import * as repo from '../repositories/homework.repository.js';

// CREATE
export const createHomeworkService = async (data: any) => {
    const id = uuid();

    // 🔥 vérifier teacher existe
    const [rows]: any = await db.query(
        `SELECT id, role FROM users WHERE id = ?`,
        [data.teacherId]
    );

    const user = rows[0];

    if (!user) throw new Error('Teacher not found');

    if (user.role !== 'TEACHER') {
        throw new Error('User is not a teacher');
    }

    return repo.createHomework({
        ...data,
        id
    });
};

// GET ALL
export const getHomeworksService = () =>
    repo.findHomeworks();

// 🔥 GET MY HOMEWORKS (LOGIQUE MÉTIER)
export const getMyHomeworksService = async (userId: string) => {
    const [userRows]: any = await db.query(
        `SELECT id, role FROM users WHERE id = ?`,
        [userId]
    );

    const user = userRows[0];

    if (!user) throw new Error('User not found');

    let classIds: string[] = [];

    // STUDENT
    if (user.role === 'STUDENT') {
        const [studentRows]: any = await db.query(
            `SELECT id FROM students WHERE userId = ?`,
            [userId]
        );

        const student = studentRows[0];

        if (student) {
            const [classes]: any = await db.query(
                `SELECT classId FROM student_classes 
                 WHERE studentId = ? AND isActive = 1`,
                [student.id]
            );

            classIds = classes.map((c: any) => c.classId);
        }
    }

    // PARENT
    if (user.role === 'PARENT') {
        const [children]: any = await db.query(
            `SELECT studentId FROM parent_students WHERE parentId = ?`,
            [userId]
        );

        const studentIds = children.map((c: any) => c.studentId);

        if (studentIds.length > 0) {
            const [classes]: any = await db.query(
                `SELECT classId FROM student_classes 
                 WHERE studentId IN (?) AND isActive = 1`,
                [studentIds]
            );

            classIds = classes.map((c: any) => c.classId);
        }
    }

    if (classIds.length === 0) {
        classIds = ['__NONE__'];
    }

    return repo.findByClasses(classIds);
};

export const getFilteredHomeworksService = (filters: any) => {
    return repo.findWithFilters(filters);
};

// UPDATE
export const updateHomeworkService = (id: string, data: any) =>
    repo.updateHomework(id, data);

// DELETE
export const deleteHomeworkService = (id: string) =>
    repo.deleteHomework(id);