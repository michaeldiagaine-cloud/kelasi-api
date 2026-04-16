import { UserRole } from '../types'; // adapte le chemin si besoin

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
                schoolId: string | null;
            };
        }
    }
}