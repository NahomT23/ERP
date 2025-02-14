import { Request, Response, NextFunction } from 'express';

export const validateSalesLeadInput = (req: Request, res: Response, next: NextFunction) => {
  const { contactInfo, pipelineStep } = req.body;

  if (!contactInfo || !pipelineStep) {
    res.status(400).json({ message: 'Contact Info and Pipeline Step are required' });
    return;
  }

  next();
};