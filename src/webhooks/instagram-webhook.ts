import { Response, NextFunction, Router, Request } from "express";
import { messageHandler as igMessageHandler } from "../controllers/com/instagram";
 
const router = Router();

router.get('/', function (req: Request, res: Response, next: NextFunction) {
    let verificationToken;

    try {
        if (process.env.WEBHOOK_VERIFICATION_TOKEN) {
            verificationToken = process.env.WEBHOOK_VERIFICATION_TOKEN;
        } else {
            verificationToken = null;
        }
        
        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == verificationToken) {
            res.status(200).send(req.query['hub.challenge']);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    
    try {
        if (data != undefined) {
            next();
        }

        if (data.object === "instagram") {
            igMessageHandler(req, res, next);
        } else {
            res.status(404).json({ error: 'Service not defined' });
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

export default router;