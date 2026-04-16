// justification.dto.ts

export interface CreateJustificationDto {
    attendanceId: string;
    reason: string;
    documentUrl?: string;
}

export interface ReviewJustificationDto {
    status: 'APPROVED' | 'REJECTED';
    reviewedBy: string;
}