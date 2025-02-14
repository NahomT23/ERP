"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommunicationLogInput = void 0;
const validateCommunicationLogInput = (req, res, next) => {
    const { description } = req.body;
    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing description' });
    }
    next();
};
exports.validateCommunicationLogInput = validateCommunicationLogInput;
