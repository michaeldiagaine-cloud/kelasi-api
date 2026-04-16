// middlewares/announcement.controller.ts
import type { Request, Response } from 'express';
import * as service from '../services/announcement.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const data = await service.createAnnouncementService(req.body);
        return successResponse(res, data, 'Created', 201);
    } catch (err: any) {
        console.error(err);
        return errorResponse(res, err.message);
    }
};

export const getAnnouncements = async (_: Request, res: Response) => {
    try {
        const data = await service.getAnnouncementsService();
        return successResponse(res, data);
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

export const getBySchool = async (req: Request, res: Response) => {
    try {
        const schoolId = req.params.schoolId as string;

        const data = await service.getBySchoolService(schoolId);

        return successResponse(res, data);
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};

export const getMyAnnouncements = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        const read = req.query.read as string;

        const data = await service.getMyAnnouncementsService(userId, read);

        return successResponse(res, data);
    } catch (err: any) {
        console.error(err);
        return errorResponse(res, err.message);
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const announcementId = req.params.id as string;

        // ⚠️ idéalement depuis auth middleware
        const userId = req.body.userId;

        await service.markAsReadService(announcementId, userId);

        return successResponse(res, null, 'Marked as read');
    } catch (err: any) {
        console.error(err);
        return errorResponse(res, err.message);
    }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const deleted = await service.deleteAnnouncementService(id);

        if (!deleted) return errorResponse(res, 'Not found', 404);

        return successResponse(res, null, 'Deleted');
    } catch (err) {
        console.error(err);
        return errorResponse(res);
    }
};