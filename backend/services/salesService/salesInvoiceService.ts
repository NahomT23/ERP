import { PrismaClient, SalesInvoiceStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new Sales Invoice
export const createSalesInvoiceService = async (data: {
  salesOrderId: number;
  amount: number;
  status: SalesInvoiceStatus;
}) => {
  try {
    const salesInvoice = await prisma.salesInvoice.create({
      data: {
        salesOrderId: data.salesOrderId,
        amount: data.amount,
        status: data.status,
      },
    });
    return salesInvoice;
  } catch (error) {
    console.error('Error creating Sales Invoice:', error);
    throw new Error('Failed to create Sales Invoice');
  }
};

// Get all Sales Invoices
export const getSalesInvoicesService = async () => {
  try {
    const salesInvoices = await prisma.salesInvoice.findMany({
      orderBy: { issuedAt: 'desc' },
    });
    return salesInvoices;
  } catch (error) {
    console.error('Error fetching Sales Invoices:', error);
    throw new Error('Failed to fetch Sales Invoices');
  }
};

// Get a single Sales Invoice by ID
export const getSalesInvoiceByIdService = async (id: number) => {
  try {
    const salesInvoice = await prisma.salesInvoice.findUnique({
      where: { id },
    });
    return salesInvoice;
  } catch (error) {
    console.error('Error fetching Sales Invoice:', error);
    throw new Error('Failed to fetch Sales Invoice');
  }
};

// Update a Sales Invoice
export const updateSalesInvoiceService = async (
  id: number,
  data: { amount?: number; status?: SalesInvoiceStatus }
) => {
  try {
    const updatedSalesInvoice = await prisma.salesInvoice.update({
      where: { id },
      data: {
        amount: data.amount,
        status: data.status,
      },
    });
    return updatedSalesInvoice;
  } catch (error) {
    console.error('Error updating Sales Invoice:', error);
    throw new Error('Failed to update Sales Invoice');
  }
};

// Delete a Sales Invoice
export const deleteSalesInvoiceService = async (id: number) => {
  try {
    const deletedSalesInvoice = await prisma.salesInvoice.delete({
      where: { id },
    });
    return !!deletedSalesInvoice; // Return true if deletion was successful
  } catch (error) {
    console.error('Error deleting Sales Invoice:', error);
    throw new Error('Failed to delete Sales Invoice');
  }
};