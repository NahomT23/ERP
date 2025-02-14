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
exports.deleteSalesLeadService = exports.updateSalesLeadService = exports.getSalesLeadByIdService = exports.getSalesLeadsService = exports.createSalesLeadService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
// Create a new Sales Lead
const createSalesLeadService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate required fields
    if (!data.customerName || !data.contactInfo || !data.pipelineStep) {
        throw new Error('Missing required fields: customerName, contactInfo, or pipelineStep');
    }
    // Ensure createdByUserId is provided
    if (!data.createdByUserId) {
        throw new Error('createdByUserId is required');
    }
    return yield prisma_1.default.salesLead.create({
        data: {
            customerName: data.customerName,
            contactInfo: data.contactInfo,
            pipelineStep: data.pipelineStep,
            customerId: data.customerId || undefined, // Ensure customerId is undefined if null
            createdByUserId: data.createdByUserId, // This must always be a valid string
        },
    });
});
exports.createSalesLeadService = createSalesLeadService;
// Get all Sales Leads
const getSalesLeadsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.salesLead.findMany();
});
exports.getSalesLeadsService = getSalesLeadsService;
// Get a single Sales Lead by ID
const getSalesLeadByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.salesLead.findUnique({
        where: { id },
    });
});
exports.getSalesLeadByIdService = getSalesLeadByIdService;
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
const updateSalesLeadService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update the SalesLead
        const updatedLead = yield prisma_1.default.salesLead.update({
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
            yield prisma_1.default.communicationLog.create({
                data: {
                    leadId: id,
                    description: 'Lead contacted',
                    timestamp: new Date(),
                },
            });
        }
        return updatedLead;
    }
    catch (error) {
        console.error('Error updating Sales Lead:', error);
        throw new Error('Failed to update Sales Lead');
    }
});
exports.updateSalesLeadService = updateSalesLeadService;
// Delete a Sales Lead
const deleteSalesLeadService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.salesLead.delete({
        where: { id },
    });
});
exports.deleteSalesLeadService = deleteSalesLeadService;
