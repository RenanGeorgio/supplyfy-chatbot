import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";
import { instagramService, telegramService, emailService } from "../services";

const serviceSelectorMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const path = req.originalUrl;

    if (path === '/incoming') {
        next();
    }

    try {
        if (req.session) {
            const service = req.session.service || "";
            
            switch (service) {
                case 'chat':
                    next();
                    break;
                case 'whatsapp':
                    next();
                    break;
                case 'instagram':
                    instagramService();
                    next();
                    break;
                case 'facebook':
                    next();
                    break;
                case 'email':
                    emailService();
                    next();
                    break;
                case 'telegram':
                    telegramService();
                    next();
                    break;
                default:
                    res.status(404).json({ error: 'Service not defined' });
                    break;
            }
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export default serviceSelectorMiddleware;