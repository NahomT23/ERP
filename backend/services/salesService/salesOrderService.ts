import { PrismaClient, SalesOrderStatus } from '@prisma/client';

const prisma = new PrismaClient();


export const createSalesOrderService = async (data: {
  quotationId: number;
  totalAmount: number;
  status: SalesOrderStatus;
  salesLeadId: number;
  customerId?: string;
  createdByUserId: string;
}) => {
  try {
    // Check if the quotation exists and is accepted
    const quotation = await prisma.quotation.findUnique({
      where: { id: data.quotationId },
    });

    if (!quotation || quotation.status !== 'ACCEPTED') {
      throw new Error('Invalid quotation ID or quotation is not accepted');
    }

    // Create the SalesOrder
    const salesOrder = await prisma.salesOrder.create({
      data: {
        quotationId: data.quotationId,
        totalAmount: data.totalAmount,
        status: data.status,
        salesLeadId: data.salesLeadId,
        customerId: data.customerId || undefined,
        createdByUserId: data.createdByUserId,
      },
    });

    return salesOrder;
  } catch (error) {
    console.error('Error creating Sales Order:', error);
    throw new Error('Failed to create Sales Order');
  }
};

export const getSalesOrdersService = async () => {
  try {
    const salesOrders = await prisma.salesOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return salesOrders;
  } catch (error) {
    throw new Error('Failed to fetch Sales Orders');
  }
};

// Get a single Sales Order by ID
export const getSalesOrderByIdService = async (id: number) => {
  try {
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id },
    });
    return salesOrder;
  } catch (error) {
    throw new Error('Failed to fetch Sales Order');
  }
};

// Update a Sales Order
export const updateSalesOrderService = async (
  id: number,
  data: { totalAmount?: number; status?: SalesOrderStatus; customerId?: string }
) => {
  try {
    const updatedSalesOrder = await prisma.salesOrder.update({
      where: { id },
      data: {
        totalAmount: data.totalAmount,
        status: data.status,
        customerId: data.customerId || undefined,
      },
    });
    return updatedSalesOrder;
  } catch (error) {
    throw new Error('Failed to update Sales Order');
  }
};

// Delete a Sales Order
export const deleteSalesOrderService = async (id: number) => {
  try {
    const deletedSalesOrder = await prisma.salesOrder.delete({
      where: { id },
    });
    return !!deletedSalesOrder; // Return true if deletion was successful
  } catch (error) {
    throw new Error('Failed to delete Sales Order');
  }
};





