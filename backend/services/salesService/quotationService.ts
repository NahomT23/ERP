import { PrismaClient, QuotationStatus } from '@prisma/client';

import prisma from '../../prisma';
// Create a new Quotation
export const createQuotationService = async (data: {
  customerId?: string;
  totalAmount: number;
  status: QuotationStatus;
  createdByUserId: string;
}) => {
  try {
    const quotation = await prisma.quotation.create({
      data: {
        customerId: data.customerId || undefined,
        totalAmount: data.totalAmount,
        status: data.status,
        createdByUserId: data.createdByUserId,
      },
    });
    return quotation;
  } catch (error) {
    console.error('Error creating Quotation:', error);
    throw new Error('Failed to create Quotation');
  }
};

// Get all Quotations
export const getQuotationsService = async () => {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return quotations;
  } catch (error) {
    console.error('Error fetching Quotations:', error);
    throw new Error('Failed to fetch Quotations');
  }
};

// Get a single Quotation by ID
export const getQuotationByIdService = async (id: number) => {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
    });
    return quotation;
  } catch (error) {
    console.error('Error fetching Quotation:', error);
    throw new Error('Failed to fetch Quotation');
  }
};


export const updateQuotationService = async (
  id: number,
  data: { totalAmount?: number; status?: QuotationStatus; customerId?: string }
) => {
  try {
    // Update the Quotation
    const updatedQuotation = await prisma.quotation.update({
      where: { id },
      data: {
        totalAmount: data.totalAmount,
        status: data.status,
        customerId: data.customerId || undefined,
      },
    });

    // Automatically log if the status changes to SENT
    if (data.status === 'SENT') {
      const lead = await prisma.salesLead.findFirst({
        where: { salesOrders: { some: { quotationId: id } } },
      });

      if (lead) {
        await prisma.communicationLog.create({
          data: {
            leadId: lead.id,
            description: 'Quotation sent',
            timestamp: new Date(),
          },
        });
      }
    }

    return updatedQuotation;
  } catch (error) {
    console.error('Error updating Quotation:', error);
    throw new Error('Failed to update Quotation');
  }
};




// Helper function to validate status transitions
const isValidStatusTransition = (currentStatus: QuotationStatus, newStatus: QuotationStatus): boolean => {
  const validTransitions: Record<QuotationStatus, QuotationStatus[]> = {
    DRAFT: ['SENT'],
    SENT: ['ACCEPTED', 'REJECTED'],
    ACCEPTED: [],
    REJECTED: [],
  };

  return validTransitions[currentStatus].includes(newStatus);
};

// Delete a Quotation
export const deleteQuotationService = async (id: number) => {
  try {
    const deletedQuotation = await prisma.quotation.delete({
      where: { id },
    });
    return !!deletedQuotation; // Return true if deletion was successful
  } catch (error) {
    console.error('Error deleting Quotation:', error);
    throw new Error('Failed to delete Quotation');
  }
};