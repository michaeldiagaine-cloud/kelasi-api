// src/app.s
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import schoolRoutes from './routes/school.routes.js';
import userRoutes from './routes/user.routes.js';
import classRoutes from './routes/class.routes.js';
import studentRoutes from './routes/student.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import justificationRoutes from './routes/justification.routes.js';
import studentClassRoutes from './routes/studentClass.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import parentStudentRoutes from './routes/parentStudent.routes.js';
import teacherAssignmentRoutes from './routes/teacherAssignment.routes.js';
import schoolPrincipalRoutes from './routes/schoolPrincipal.routes.js';
import disciplineRoutes from './routes/discipline.routes.js';
import homeworkRoutes from './routes/homework.routes.js';
import { swaggerUi, specs } from './config/swagger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/justifications', justificationRoutes);
app.use('/api/student-classes', studentClassRoutes);
app.use('/api/parent-students', parentStudentRoutes);
app.use('/api/studentClass', studentClassRoutes);
app.use('/api/teacher-assignments', teacherAssignmentRoutes);
app.use('/api/school-principals', schoolPrincipalRoutes);
app.use('/api/homeworks', homeworkRoutes);
app.use('/api/discipline', disciplineRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));