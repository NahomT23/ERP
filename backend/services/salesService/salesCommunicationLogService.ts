import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
export const updateCommunicationLogService = async (logId: number, description: string) => {
    try {
        const updatedLog = await prisma.communicationLog.update({
            where: { id: logId },
            data: { description },
        });
        return updatedLog;
    } catch (error) {
        throw new Error('Failed to update communication log');
    }
};

// Delete a communication log
export const deleteCommunicationLogService = async (logId: number) => {
    try {
        await prisma.communicationLog.delete({
            where: { id: logId },
        });
    } catch (error) {
        throw new Error('Failed to delete communication log');
    }
};




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

export const addCommunicationLogService = async (leadId: number, description: string) => {
    try {
      const log = await prisma.communicationLog.create({
        data: {
          leadId,
          description,
        },
      });
      return log;
    } catch (error) {
      console.error('Error adding communication log:', error);
      throw new Error('Failed to add communication log');
    }
  };


// Get all communication logs for a Sales Lead
export const getCommunicationLogsForLeadService = async (leadId: number) => {
    try {
        const logs = await prisma.communicationLog.findMany({
            where: { leadId },
            orderBy: { timestamp: 'desc' },
        });
        return logs;
    } catch (error) {
        throw new Error('Failed to fetch communication logs');
    }
};