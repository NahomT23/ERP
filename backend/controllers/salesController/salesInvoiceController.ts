import { Request, Response } from 'express';
import { SalesInvoiceStatus } from '@prisma/client';
import {
  createSalesInvoiceService,
  deleteSalesInvoiceService,
  getSalesInvoiceByIdService,
  getSalesInvoicesService,
  updateSalesInvoiceService,
} from '../../services/salesService/salesInvoiceService';

// Create a new Sales Invoice
export const createSalesInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { salesOrderId, amount, status } = req.body;

    // Validate required fields
    if (!salesOrderId || !amount || !status) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate status against the SalesInvoiceStatus enum
    let parsedStatus: SalesInvoiceStatus;
    if (status === 'PAID') {
      parsedStatus = SalesInvoiceStatus.PAID;
    } else if (status === 'UNPAID') {
      parsedStatus = SalesInvoiceStatus.UNPAID;
    } else {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    const salesInvoice = await createSalesInvoiceService({
      salesOrderId,
      amount,
      status: parsedStatus,
    });

    res.status(201).json(salesInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Sales Invoices
export const getSalesInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const salesInvoices = await getSalesInvoicesService();
    res.status(200).json(salesInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single Sales Invoice by ID
export const getSalesInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const salesInvoice = await getSalesInvoiceByIdService(parseInt(id, 10));
    if (!salesInvoice) {
      res.status(404).json({ error: 'Sales Invoice not found' });
      return;
    }
    res.status(200).json(salesInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Sales Invoice
export const updateSalesInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, status } = req.body;

    let parsedStatus: SalesInvoiceStatus | undefined;
    if (status) {
      if (status === 'PAID') {
        parsedStatus = SalesInvoiceStatus.PAID;
      } else if (status === 'UNPAID') {
        parsedStatus = SalesInvoiceStatus.UNPAID;
      } else {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }
    }

    const updatedSalesInvoice = await updateSalesInvoiceService(parseInt(id, 10), {
      amount,
      status: parsedStatus,
    });

    if (!updatedSalesInvoice) {
      res.status(404).json({ error: 'Sales Invoice not found' });
      return;
    }

    res.status(200).json(updatedSalesInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Sales Invoice
export const deleteSalesInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await deleteSalesInvoiceService(parseInt(id, 10));
    if (!success) {
      res.status(404).json({ error: 'Sales Invoice not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};