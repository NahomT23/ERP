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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesOrderService = exports.updateSalesOrderService = exports.getSalesOrderByIdService = exports.getSalesOrdersService = exports.createSalesOrderService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// // Create a new Sales Order
// // Create a new Sales Order
// export const createSalesOrderService = async (data: {
//   quotationId: number;
//   totalAmount: number;
//   status: SalesOrderStatus;
//   salesLeadId: number;
//   customerId?: string;
//   createdByUserId: string; // Add this field
// }) => {
//   try {
//     const salesOrder = await prisma.salesOrder.create({
//       data: {
//         quotationId: data.quotationId,
//         totalAmount: data.totalAmount,
//         status: data.status,
//         salesLeadId: data.salesLeadId,
//         customerId: data.customerId || undefined,
//         createdByUserId: data.createdByUserId, // Include createdByUserId here
//       },
//     });
//     return salesOrder;
//   } catch (error) {
//     throw new Error('Failed to create Sales Order');
//   }
// };
// export const createSalesOrderService = async (data: {
//   quotationId: number;
//   totalAmount: number;
//   status: SalesOrderStatus;
//   salesLeadId: number;
//   customerId?: string;
//   createdByUserId: string;
// }) => {
//   try {
//     // Check if the quotation exists and is accepted
//     const quotation = await prisma.quotation.findUnique({
//       where: { id: data.quotationId },
//     });
//     if (!quotation || quotation.status !== 'ACCEPTED') {
//       throw new Error('Invalid quotation ID or quotation is not accepted');
//     }
//     const salesOrder = await prisma.salesOrder.create({
//       data: {
//         quotationId: data.quotationId,
//         totalAmount: data.totalAmount,
//         status: data.status,
//         salesLeadId: data.salesLeadId,
//         customerId: data.customerId || undefined,
//         createdByUserId: data.createdByUserId,
//       },
//     });
//     return salesOrder;
//   } catch (error) {
//     console.error('Error creating Sales Order:', error);
//     throw new Error('Failed to create Sales Order');
//   }
// };
const createSalesOrderService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the quotation exists and is accepted
        const quotation = yield prisma.quotation.findUnique({
            where: { id: data.quotationId },
        });
        if (!quotation || quotation.status !== 'ACCEPTED') {
            throw new Error('Invalid quotation ID or quotation is not accepted');
        }
        // Create the SalesOrder
        const salesOrder = yield prisma.salesOrder.create({
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
    }
    catch (error) {
        console.error('Error creating Sales Order:', error);
        throw new Error('Failed to create Sales Order');
    }
});
exports.createSalesOrderService = createSalesOrderService;
const getSalesOrdersService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesOrders = yield prisma.salesOrder.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return salesOrders;
    }
    catch (error) {
        throw new Error('Failed to fetch Sales Orders');
    }
});
exports.getSalesOrdersService = getSalesOrdersService;
// Get a single Sales Order by ID
const getSalesOrderByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesOrder = yield prisma.salesOrder.findUnique({
            where: { id },
        });
        return salesOrder;
    }
    catch (error) {
        throw new Error('Failed to fetch Sales Order');
    }
});
exports.getSalesOrderByIdService = getSalesOrderByIdService;
// Update a Sales Order
const updateSalesOrderService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSalesOrder = yield prisma.salesOrder.update({
            where: { id },
            data: {
                totalAmount: data.totalAmount,
                status: data.status,
                customerId: data.customerId || undefined,
            },
        });
        return updatedSalesOrder;
    }
    catch (error) {
        throw new Error('Failed to update Sales Order');
    }
});
exports.updateSalesOrderService = updateSalesOrderService;
// Delete a Sales Order
const deleteSalesOrderService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSalesOrder = yield prisma.salesOrder.delete({
            where: { id },
        });
        return !!deletedSalesOrder; // Return true if deletion was successful
    }
    catch (error) {
        throw new Error('Failed to delete Sales Order');
    }
});
exports.deleteSalesOrderService = deleteSalesOrderService;
// {
//   "quotationId": 4,
//   "totalAmount": 1000.0,
//   "status": "PENDING",
//   "salesLeadId": 2,
//   "customerId": "dea8830f-78e0-44b3-b4f6-3c840e078fa7",
//   "createdByUserId": "33ecfb49-8082-4e5d-9bb3-c99a50e20731"
// }
