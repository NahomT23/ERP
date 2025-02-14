"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuotationService = exports.updateQuotationService = exports.getQuotationByIdService = exports.getQuotationsService = exports.createQuotationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
// Create a new Quotation
const createQuotationService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotation = yield prisma_1.default.quotation.create({
            data: {
                customerId: data.customerId || undefined,
                totalAmount: data.totalAmount,
                status: data.status,
                createdByUserId: data.createdByUserId,
            },
        });
        return quotation;
    }
    catch (error) {
        console.error('Error creating Quotation:', error);
        throw new Error('Failed to create Quotation');
    }
});
exports.createQuotationService = createQuotationService;
// Get all Quotations
const getQuotationsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotations = yield prisma_1.default.quotation.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return quotations;
    }
    catch (error) {
        console.error('Error fetching Quotations:', error);
        throw new Error('Failed to fetch Quotations');
    }
});
exports.getQuotationsService = getQuotationsService;
// Get a single Quotation by ID
const getQuotationByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotation = yield prisma_1.default.quotation.findUnique({
            where: { id },
        });
        return quotation;
    }
    catch (error) {
        console.error('Error fetching Quotation:', error);
        throw new Error('Failed to fetch Quotation');
    }
});
exports.getQuotationByIdService = getQuotationByIdService;
// // Update a Quotation
// export const updateQuotationService = async (
//   id: number,
//   data: { totalAmount?: number; status?: QuotationStatus; customerId?: string }
// ) => {
//   try {
//     const updatedQuotation = await prisma.quotation.update({
//       where: { id },
//       data: {
//         totalAmount: data.totalAmount,
//         status: data.status,
//         customerId: data.customerId || undefined,
//       },
//     });
//     return updatedQuotation;
//   } catch (error) {
//     console.error('Error updating Quotation:', error);
//     throw new Error('Failed to update Quotation');
//   }
// };
// export const updateQuotationService = async (
//   id: number,
//   data: { totalAmount?: number; status?: QuotationStatus; customerId?: string }
// ) => {
//   try {
//     const existingQuotation = await prisma.quotation.findUnique({
//       where: { id },
//     });
//     if (!existingQuotation) {
//       throw new Error('Quotation not found');
//     }
//     // Validate status transitions
//     if (data.status && !isValidStatusTransition(existingQuotation.status, data.status)) {
//       throw new Error('Invalid status transition');
//     }
//     const updatedQuotation = await prisma.quotation.update({
//       where: { id },
//       data: {
//         totalAmount: data.totalAmount,
//         status: data.status,
//         customerId: data.customerId || undefined,
//       },
//     });
//     return updatedQuotation;
//   } catch (error) {
//     console.error('Error updating Quotation:', error);
//     throw new Error('Failed to update Quotation');
//   }
// };
const updateQuotationService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update the Quotation
        const updatedQuotation = yield prisma_1.default.quotation.update({
            where: { id },
            data: {
                totalAmount: data.totalAmount,
                status: data.status,
                customerId: data.customerId || undefined,
            },
        });
        // Automatically log if the status changes to SENT
        if (data.status === 'SENT') {
            const lead = yield prisma_1.default.salesLead.findFirst({
                where: { salesOrders: { some: { quotationId: id } } },
            });
            if (lead) {
                yield prisma_1.default.communicationLog.create({
                    data: {
                        leadId: lead.id,
                        description: 'Quotation sent',
                        timestamp: new Date(),
                    },
                });
            }
        }
        return updatedQuotation;
    }
    catch (error) {
        console.error('Error updating Quotation:', error);
        throw new Error('Failed to update Quotation');
    }
});
exports.updateQuotationService = updateQuotationService;
// Helper function to validate status transitions
const isValidStatusTransition = (currentStatus, newStatus) => {
    const validTransitions = {
        DRAFT: ['SENT'],
        SENT: ['ACCEPTED', 'REJECTED'],
        ACCEPTED: [],
        REJECTED: [],
    };
    return validTransitions[currentStatus].includes(newStatus);
};
// Delete a Quotation
const deleteQuotationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedQuotation = yield prisma_1.default.quotation.delete({
            where: { id },
        });
        return !!deletedQuotation; // Return true if deletion was successful
    }
    catch (error) {
        console.error('Error deleting Quotation:', error);
        throw new Error('Failed to delete Quotation');
    }
});
exports.deleteQuotationService = deleteQuotationService;
