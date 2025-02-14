import { Request, Response } from 'express';
import { QuotationStatus } from '@prisma/client';
import {
  createQuotationService,
  deleteQuotationService,
  getQuotationByIdService,
  getQuotationsService,
  updateQuotationService,
} from '../../services/salesService/quotationService';
import { ExpressRequest } from '../../middlewares/authMiddleware/authMiddleware';

// Create a new Quotation
export const createQuotation = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { customerId, totalAmount, status } = req.body;

    // Extract the authenticated user's ID
    const createdByUserId = req.user?.id;
    if (!createdByUserId) {
      res.status(401).json({ error: 'Unauthorized: User ID is missing' });
      return;
    }

    // Validate required fields
    if (!totalAmount || !status) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate status against the QuotationStatus enum
    let parsedStatus: QuotationStatus;
    if (status === 'DRAFT') {
      parsedStatus = QuotationStatus.DRAFT;
    } else if (status === 'SENT') {
      parsedStatus = QuotationStatus.SENT;
    } else if (status === 'ACCEPTED') {
      parsedStatus = QuotationStatus.ACCEPTED;
    } else if (status === 'REJECTED') {
      parsedStatus = QuotationStatus.REJECTED;
    } else {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    // Call the service
    const quotation = await createQuotationService({
      customerId,
      totalAmount,
      status: parsedStatus,
      createdByUserId,
    });

    res.status(201).json(quotation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Quotations
export const getQuotations = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotations = await getQuotationsService();
    res.status(200).json(quotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single Quotation by ID
export const getQuotationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const quotation = await getQuotationByIdService(parseInt(id, 10));
    if (!quotation) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    res.status(200).json(quotation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Quotation
// export const updateQuotation = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { totalAmount, status, customerId } = req.body;

//     let parsedStatus: QuotationStatus | undefined;
//     if (status) {
//       if (status === 'DRAFT') {
//         parsedStatus = QuotationStatus.DRAFT;
//       } else if (status === 'SENT') {
//         parsedStatus = QuotationStatus.SENT;
//       } else if (status === 'ACCEPTED') {
//         parsedStatus = QuotationStatus.ACCEPTED;
//       } else if (status === 'REJECTED') {
//         parsedStatus = QuotationStatus.REJECTED;
//       } else {
//         res.status(400).json({ error: 'Invalid status value' });
//         return;
//       }
//     }

//     const updatedQuotation = await updateQuotationService(parseInt(id, 10), {
//       totalAmount,
//       status: parsedStatus,
//       customerId,
//     });

//     if (!updatedQuotation) {
//       res.status(404).json({ error: 'Quotation not found' });
//       return;
//     }

//     res.status(200).json(updatedQuotation);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

export const updateQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let parsedStatus: QuotationStatus | undefined;
    if (status) {
      if (['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'].includes(status)) {
        parsedStatus = status as QuotationStatus;
      } else {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }
    }

    const updatedQuotation = await updateQuotationService(parseInt(id, 10), {
      status: parsedStatus,
    });

    if (!updatedQuotation) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }

    res.status(200).json(updatedQuotation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Quotation
export const deleteQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await deleteQuotationService(parseInt(id, 10));
    if (!success) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};