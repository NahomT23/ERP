"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSalesLeadInput = void 0;
const validateSalesLeadInput = (req, res, next) => {
    const { contactInfo, pipelineStep } = req.body;
    if (!contactInfo || !pipelineStep) {
        res.status(400).json({ message: 'Contact Info and Pipeline Step are required' });
        return;
    }
    next();
};
exports.validateSalesLeadInput = validateSalesLeadInput;
