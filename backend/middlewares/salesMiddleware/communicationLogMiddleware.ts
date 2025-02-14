import { Request, Response, NextFunction } from 'express';

export const validateCommunicationLogInput = (req: Request, res: Response, next: NextFunction) => {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing description' });
    }

    next();
};