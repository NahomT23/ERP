import { Request, Response } from 'express';
import { SalesOrderStatus } from '@prisma/client';
import {
  createSalesOrderService,
  deleteSalesOrderService,
  getSalesOrderByIdService,
  getSalesOrdersService,
  updateSalesOrderService,
} from '../../services/salesService/salesOrderService';
import { ExpressRequest } from '../../middlewares/authMiddleware/authMiddleware';

// export const createSalesOrder = async (req: ExpressRequest, res: Response): Promise<void> => {
//   try {
//     const { quotationId, totalAmount, status, salesLeadId, customerId } = req.body;

//     // Extract the authenticated user's ID (assuming it's available in the request)
//     const createdByUserId = req.user?.id; // Adjust this based on your authentication setup

//     if (!quotationId || !totalAmount || !status || !salesLeadId || !createdByUserId) {
//       res.status(400).json({ error: 'Missing required fields' });
//       return;
//     }

//     // Validate status against the SalesOrderStatus enum
//     let parsedStatus: SalesOrderStatus;
//     if (status === 'PENDING') {
//       parsedStatus = SalesOrderStatus.PENDING;
//     } else if (status === 'COMPLETED') {
//       parsedStatus = SalesOrderStatus.COMPLETED;
//     } else {
//       res.status(400).json({ error: 'Invalid status value' });
//       return;
//     }

//     const salesOrder = await createSalesOrderService({
//       quotationId,
//       totalAmount,
//       status: parsedStatus,
//       salesLeadId,
//       customerId,
//       createdByUserId: ''
//     });

//     res.status(201).json(salesOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// Get all Sales Orders





export const createSalesOrder = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { quotationId, totalAmount, status, salesLeadId, customerId } = req.body;

    // Extract the authenticated user's ID
    const createdByUserId = req.user?.id;
    if (!createdByUserId) {
      res.status(401).json({ error: 'Unauthorized: User ID is missing' });
      return;
    }

    // Validate required fields
    if (!quotationId || !totalAmount || !status || !salesLeadId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate status
    let parsedStatus: SalesOrderStatus;
    if (status === 'PENDING') {
      parsedStatus = SalesOrderStatus.PENDING;
    } else if (status === 'COMPLETED') {
      parsedStatus = SalesOrderStatus.COMPLETED;
    } else {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    // Call the service
    const salesOrder = await createSalesOrderService({
      quotationId,
      totalAmount,
      status: parsedStatus,
      salesLeadId,
      customerId,
      createdByUserId,
    });

    res.status(201).json(salesOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getSalesOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const salesOrders = await getSalesOrdersService();
    res.status(200).json(salesOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single Sales Order by ID
export const getSalesOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const salesOrder = await getSalesOrderByIdService(parseInt(id, 10));
    if (!salesOrder) {
      res.status(404).json({ error: 'Sales Order not found' });
      return;
    }

    res.status(200).json(salesOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Sales Order
export const updateSalesOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { totalAmount, status, customerId } = req.body;

    let parsedStatus: SalesOrderStatus | undefined;
    if (status) {
      if (status === 'PENDING') {
        parsedStatus = SalesOrderStatus.PENDING;
      } else if (status === 'COMPLETED') {
        parsedStatus = SalesOrderStatus.COMPLETED;
      } else {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }
    }

    const updatedSalesOrder = await updateSalesOrderService(parseInt(id, 10), {
      totalAmount,
      status: parsedStatus,
      customerId,
    });

    if (!updatedSalesOrder) {
      res.status(404).json({ error: 'Sales Order not found' });
      return;
    }

    res.status(200).json(updatedSalesOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Sales Order
export const deleteSalesOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const success = await deleteSalesOrderService(parseInt(id, 10));
    if (!success) {
      res.status(404).json({ error: 'Sales Order not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};