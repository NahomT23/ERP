import prisma from '../../prisma';
import { LeadPipelineStep, SalesLead } from '@prisma/client';

// Create a new Sales Lead
export const createSalesLeadService = async (data: Partial<SalesLead>): Promise<SalesLead> => {
  // Validate required fields
  if (!data.customerName || !data.contactInfo || !data.pipelineStep) {
    throw new Error('Missing required fields: customerName, contactInfo, or pipelineStep');
  }

  // Ensure createdByUserId is provided
  if (!data.createdByUserId) {
    throw new Error('createdByUserId is required');
  }

  return await prisma.salesLead.create({
    data: {
      customerName: data.customerName,
      contactInfo: data.contactInfo,
      pipelineStep: data.pipelineStep,
      customerId: data.customerId || undefined, // Ensure customerId is undefined if null
      createdByUserId: data.createdByUserId, // This must always be a valid string
    },
  });
};

// Get all Sales Leads
export const getSalesLeadsService = async (): Promise<SalesLead[]> => {
  return await prisma.salesLead.findMany();
};

// Get a single Sales Lead by ID
export const getSalesLeadByIdService = async (id: number): Promise<SalesLead | null> => {
  return await prisma.salesLead.findUnique({
    where: { id },
  });
};

// // Update a Sales Lead
// export const updateSalesLeadService = async (
//   id: number,
//   data: Partial<SalesLead>
// ): Promise<SalesLead | null> => {
//   return await prisma.salesLead.update({
//     where: { id },
//     data: {
//       customerName: data.customerName,
//       contactInfo: data.contactInfo,
//       pipelineStep: data.pipelineStep,
//       customerId: data.customerId || undefined, // Ensure customerId is undefined if null
//     },
//   });
// };

export const updateSalesLeadService = async (
  id: number,
  data: { customerId?: string; customerName?: string; contactInfo?: string; pipelineStep?: LeadPipelineStep }
) => {
  try {
    // Update the SalesLead
    const updatedLead = await prisma.salesLead.update({
      where: { id },
      data: {
        customerId: data.customerId || undefined,
        customerName: data.customerName,
        contactInfo: data.contactInfo,
        pipelineStep: data.pipelineStep,
      },
    });

    // Automatically log if the pipelineStep changes to CONTACTED
    if (data.pipelineStep === 'CONTACTED') {
      await prisma.communicationLog.create({
        data: {
          leadId: id,
          description: 'Lead contacted',
          timestamp: new Date(),
        },
      });
    }

    return updatedLead;
  } catch (error) {
    console.error('Error updating Sales Lead:', error);
    throw new Error('Failed to update Sales Lead');
  }
};

// Delete a Sales Lead
export const deleteSalesLeadService = async (id: number): Promise<SalesLead | null> => {
  return await prisma.salesLead.delete({
    where: { id },
  });
};