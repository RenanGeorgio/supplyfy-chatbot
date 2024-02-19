import { Response, NextFunction } from "express";
import { CustomRequest } from "../../helpers/customRequest";
import { processQuestion } from "../../helpers/trainModel";

export const markMessageAsRead = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageId } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                status: 'read',
                //to: this.recipientPhoneNumber,
                message_id: messageId
            },
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendTextMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const sendButtonsMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const sendContacts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const sendRadioButtons = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const sendImageByLink = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const uploadMedia = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const sendDocumentMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};

export const sendLocation = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;

        let response = await processQuestion(question);
        
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};