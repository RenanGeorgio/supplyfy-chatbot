import { Response, NextFunction, Router } from "express";
import XHubSignature from "x-hub-signature";
import { CustomRequest } from "../../helpers/customRequest";

const verificationToken = process.env.WEBHOOK_VERIFICATION_TOKEN;
const appSecret = process.env.APP_SECRET;
const xhub = new XHubSignature("SHA256", appSecret);
 
const router = Router();

router.get('/', function (req: CustomRequest, res: Response, next: NextFunction) {
    try {
        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == verificationToken) {
            res.status(200).send(req.query['hub.challenge']);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', function (req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const { service } = req.session.user;

        switch (service) {
            case 'whasapp':
                messageHandler(req, res);
                break;
            case 'facebook':
                eventsHandler(req, res);
            default:
                res.status(404).json({ error: 'Service not defined' });
                break;
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

export default router;