import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";

const serviceSelectorMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
                case 'whatsappWeb':
                    next();
                    break;
                case 'instagram':
                    next();
                    break;
                case 'instagramWeb':
                    next();
                    break;
                case 'facebook':
                    next();
                    break;
                case 'email':
                    next();
                    break;
                case 'telegram':
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