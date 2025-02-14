import { Request, Response } from 'express';
import { addCommunicationLogService, deleteCommunicationLogService, getCommunicationLogsForLeadService, updateCommunicationLogService } from '../../services/salesService/salesCommunicationLogService';
import prisma from '../../prisma';

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
export const updateCommunicationLog = async (req: Request, res: Response) => {
    try {
        const { logId } = req.params;
        const { description } = req.body;

        if (!description) {
             res.status(400).json({ error: 'Description is required' });
        }

        const updatedLog = await updateCommunicationLogService(parseInt(logId, 10), description);
        res.status(200).json(updatedLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a communication log
export const deleteCommunicationLog = async (req: Request, res: Response) => {
    try {
        const { logId } = req.params;

        await deleteCommunicationLogService(parseInt(logId, 10));
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




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


export const addCommunicationLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { leadId } = req.params;
      const { description } = req.body;
  
      // Validate required fields
      if (!description) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
  
      // Check if the lead exists
      const lead = await prisma.salesLead.findUnique({
        where: { id: parseInt(leadId, 10) },
      });
  
      if (!lead) {
        res.status(404).json({ error: 'Sales Lead not found' });
        return;
      }
  
      // Create the communication log
      const log = await prisma.communicationLog.create({
        data: {
          leadId: parseInt(leadId, 10),
          description,
          timestamp: new Date(),
        },
      });
  
      res.status(201).json(log);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
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


export const getCommunicationLogsForLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { leadId } = req.params;
  
      // Check if the lead exists
      const lead = await prisma.salesLead.findUnique({
        where: { id: parseInt(leadId, 10) },
      });
  
      if (!lead) {
        res.status(404).json({ error: 'Sales Lead not found' });
        return;
      }
  
      // Retrieve communication logs for the lead
      const logs = await prisma.communicationLog.findMany({
        where: { leadId: parseInt(leadId, 10) },
        orderBy: { timestamp: 'desc' },
      });
  
      res.status(200).json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };