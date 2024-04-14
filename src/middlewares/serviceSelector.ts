import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";
import { instagramService, telegramService, emailService } from "../services";
import mongoose from "mongoose";

const serviceSelectorMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const path = req.originalUrl;

    if (path === '/incoming') {
        next();
    }

    try {
        if (req.session) {
            const service = req.session.service || null;
            
            switch (service) {
                case 'chat':
                    next();
                    break;
                case 'whatsapp':
                    next();
                    break;
                case 'instagram':
                    //instagramService(); OLD
                    next();
                    break;
                case 'facebook':
                    next();
                    break;
                case 'email':
                    //emailService(); OLD
                    next();
                    break;
                case 'telegram':
		    //telegramService(); OLD
                    next();
                    break;
                case 'cadastro':
                    next();
                    break;
                default:
                    res.status(404).json({ error: 'Service not defined' });
                    break;
            }
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error: any) {
        next(error)
    }
};

export default serviceSelectorMiddleware;