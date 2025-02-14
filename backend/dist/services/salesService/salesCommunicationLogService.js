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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunicationLogsForLeadService = exports.addCommunicationLogService = exports.deleteCommunicationLogService = exports.updateCommunicationLogService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Add a communication log
// export const addCommunicationLogService = async (leadId: number, description: string) => {
//     try {
//         const log = await prisma.communicationLog.create({
//             data: {
//                 leadId,
//                 description,
//             },
//         });
//         return log;
//     } catch (error) {
//         throw new Error('Failed to add communication log');
//     }
// };
// // Get all communication logs for a Sales Lead
// export const getCommunicationLogsForLeadService = async (leadId: number) => {
//     try {
//         const logs = await prisma.communicationLog.findMany({
//             where: { leadId },
//             orderBy: { timestamp: 'desc' },
//         });
//         return logs;
//     } catch (error) {
//         throw new Error('Failed to fetch communication logs');
//     }
// };
// Update a communication log
const updateCommunicationLogService = (logId, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedLog = yield prisma.communicationLog.update({
            where: { id: logId },
            data: { description },
        });
        return updatedLog;
    }
    catch (error) {
        throw new Error('Failed to update communication log');
    }
});
exports.updateCommunicationLogService = updateCommunicationLogService;
// Delete a communication log
const deleteCommunicationLogService = (logId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.communicationLog.delete({
            where: { id: logId },
        });
    }
    catch (error) {
        throw new Error('Failed to delete communication log');
    }
});
exports.deleteCommunicationLogService = deleteCommunicationLogService;
// // Add a communication log
// export const addCommunicationLogService = async (leadId: number, description: string) => {
//     try {
//         const log = await prisma.communicationLog.create({
//             data: {
//                 leadId,
//                 description,
//             },
//         });
//         return log;
//     } catch (error) {
//         throw new Error('Failed to add communication log');
//     }
// };
const addCommunicationLogService = (leadId, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const log = yield prisma.communicationLog.create({
            data: {
                leadId,
                description,
            },
        });
        return log;
    }
    catch (error) {
        console.error('Error adding communication log:', error);
        throw new Error('Failed to add communication log');
    }
});
exports.addCommunicationLogService = addCommunicationLogService;
// Get all communication logs for a Sales Lead
const getCommunicationLogsForLeadService = (leadId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield prisma.communicationLog.findMany({
            where: { leadId },
            orderBy: { timestamp: 'desc' },
        });
        return logs;
    }
    catch (error) {
        throw new Error('Failed to fetch communication logs');
    }
});
exports.getCommunicationLogsForLeadService = getCommunicationLogsForLeadService;
