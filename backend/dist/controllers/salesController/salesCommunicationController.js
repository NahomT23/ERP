"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunicationLogsForLead = exports.addCommunicationLog = exports.deleteCommunicationLog = exports.updateCommunicationLog = void 0;
const salesCommunicationLogService_1 = require("../../services/salesService/salesCommunicationLogService");
const prisma_1 = __importDefault(require("../../prisma"));
// // Add a communication log to a Sales Lead
// export const addCommunicationLog = async (req: Request, res: Response) => {
//     try {
//         const { leadId } = req.params;
//         const { description } = req.body;
//         if (!description) {
//             return res.status(400).json({ error: 'Description is required' });
//         }
//         const log = await addCommunicationLogService(parseInt(leadId, 10), description);
//         res.status(201).json(log);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
// // Get all communication logs for a Sales Lead
// export const getCommunicationLogsForLead = async (req: Request, res: Response) => {
//     try {
//         const { leadId } = req.params;
//         const logs = await getCommunicationLogsForLeadService(parseInt(leadId, 10));
//         res.status(200).json(logs);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
// Update a communication log
const updateCommunicationLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logId } = req.params;
        const { description } = req.body;
        if (!description) {
            res.status(400).json({ error: 'Description is required' });
        }
        const updatedLog = yield (0, salesCommunicationLogService_1.updateCommunicationLogService)(parseInt(logId, 10), description);
        res.status(200).json(updatedLog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateCommunicationLog = updateCommunicationLog;
// Delete a communication log
const deleteCommunicationLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logId } = req.params;
        yield (0, salesCommunicationLogService_1.deleteCommunicationLogService)(parseInt(logId, 10));
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteCommunicationLog = deleteCommunicationLog;
// // Add a communication log to a Sales Lead
// export const addCommunicationLog = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { leadId } = req.params;
//         const { description } = req.body;
//         if (!description) {
//             res.status(400).json({ error: 'Description is required' });
//             return; // Ensure no value is returned
//         }
//         const log = await addCommunicationLogService(parseInt(leadId, 10), description);
//         res.status(201).json(log); // Send the response, but don't return it
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
const addCommunicationLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leadId } = req.params;
        const { description } = req.body;
        // Validate required fields
        if (!description) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Check if the lead exists
        const lead = yield prisma_1.default.salesLead.findUnique({
            where: { id: parseInt(leadId, 10) },
        });
        if (!lead) {
            res.status(404).json({ error: 'Sales Lead not found' });
            return;
        }
        // Create the communication log
        const log = yield prisma_1.default.communicationLog.create({
            data: {
                leadId: parseInt(leadId, 10),
                description,
                timestamp: new Date(),
            },
        });
        res.status(201).json(log);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.addCommunicationLog = addCommunicationLog;
// Get all communication logs for a Sales Lead
// export const getCommunicationLogsForLead = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { leadId } = req.params;
//         const logs = await getCommunicationLogsForLeadService(parseInt(leadId, 10));
//         res.status(200).json(logs); // Send the response, but don't return it
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
const getCommunicationLogsForLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leadId } = req.params;
        // Check if the lead exists
        const lead = yield prisma_1.default.salesLead.findUnique({
            where: { id: parseInt(leadId, 10) },
        });
        if (!lead) {
            res.status(404).json({ error: 'Sales Lead not found' });
            return;
        }
        // Retrieve communication logs for the lead
        const logs = yield prisma_1.default.communicationLog.findMany({
            where: { leadId: parseInt(leadId, 10) },
            orderBy: { timestamp: 'desc' },
        });
        res.status(200).json(logs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCommunicationLogsForLead = getCommunicationLogsForLead;
