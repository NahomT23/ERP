import prisma from '../../prisma';


/**
 * Sales Lead Services
 */
export const createSalesLeadService = async (data: any, userId: string) => {
  return prisma.salesLead.create({
    data: {
      customerId: data.customerId,
      customerName: data.customerName,
      contactInfo: data.contactInfo,
      pipelineStep: data.pipelineStep,
      createdByUser: {
        connect: { id: userId }, // Connect the sales lead to the authenticated user
      },
    },
  });
};

export const getSalesLeadsService = async () => {
  return prisma.salesLead.findMany({
    include: {
      customer: true,
      communicationLogs: true,
      createdByUser: true,
    },
  });
};

export const getSalesLeadByIdService = async (id: number) => {
  return prisma.salesLead.findUnique({
    where: { id },
    include: {
      customer: true,
      communicationLogs: true,
      createdByUser: true,
    },
  });
};

export const updateSalesLeadService = async (id: number, data: any) => {
  return prisma.salesLead.update({
    where: { id },
    data,
  });
};

export const deleteSalesLeadService = async (id: number) => {
  return prisma.salesLead.delete({
    where: { id },
  });
};














 // Communication Log Services
 
 export const addCommunicationLogService = async (leadId: number, description: string) => {
  return prisma.communicationLog.create({
    data: { leadId, description },
  });
};

export const getCommunicationLogsForLeadService = async (leadId: number) => {
  return prisma.communicationLog.findMany({
    where: { leadId },
  });
};

export const updateCommunicationLogService = async (logId: number, description: string) => {
  return prisma.communicationLog.update({
    where: { id: logId },
    data: { description },
  });
};

export const deleteCommunicationLogService = async (logId: number) => {
  return prisma.communicationLog.delete({
    where: { id: logId },
  });
};


// Sales Order Services

export const createSalesOrderService = async (data: any) => {
  return prisma.salesOrder.create({ data });
};

export const getSalesOrdersService = async () => {
  return prisma.salesOrder.findMany({
    include: { customer: true, salesLead: true, salesInvoices: true },
  });
};

export const getSalesOrderByIdService = async (id: number) => {
  return prisma.salesOrder.findUnique({
    where: { id },
    include: { customer: true, salesLead: true, salesInvoices: true },
  });
};

export const updateSalesOrderService = async (id: number, data: any) => {
  return prisma.salesOrder.update({ where: { id }, data });
};

export const deleteSalesOrderService = async (id: number) => {
  return prisma.salesOrder.delete({ where: { id } });
};

 // Sales Invoice Services
 
export const createSalesInvoiceService = async (data: any) => {
  return prisma.salesInvoice.create({ data });
};

export const getSalesInvoicesService = async () => {
  return prisma.salesInvoice.findMany({
    include: { salesOrder: true },
  });
};

export const getSalesInvoiceByIdService = async (id: number) => {
  return prisma.salesInvoice.findUnique({
    where: { id },
    include: { salesOrder: true },
  });
};

export const updateSalesInvoiceService = async (id: number, data: any) => {
  return prisma.salesInvoice.update({ where: { id }, data });
};

export const deleteSalesInvoiceService = async (id: number) => {
  return prisma.salesInvoice.delete({ where: { id } });
};