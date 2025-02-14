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
exports.deleteSalesInvoiceService = exports.updateSalesInvoiceService = exports.getSalesInvoiceByIdService = exports.getSalesInvoicesService = exports.createSalesInvoiceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new Sales Invoice
const createSalesInvoiceService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesInvoice = yield prisma.salesInvoice.create({
            data: {
                salesOrderId: data.salesOrderId,
                amount: data.amount,
                status: data.status,
            },
        });
        return salesInvoice;
    }
    catch (error) {
        console.error('Error creating Sales Invoice:', error);
        throw new Error('Failed to create Sales Invoice');
    }
});
exports.createSalesInvoiceService = createSalesInvoiceService;
// Get all Sales Invoices
const getSalesInvoicesService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesInvoices = yield prisma.salesInvoice.findMany({
            orderBy: { issuedAt: 'desc' },
        });
        return salesInvoices;
    }
    catch (error) {
        console.error('Error fetching Sales Invoices:', error);
        throw new Error('Failed to fetch Sales Invoices');
    }
});
exports.getSalesInvoicesService = getSalesInvoicesService;
// Get a single Sales Invoice by ID
const getSalesInvoiceByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesInvoice = yield prisma.salesInvoice.findUnique({
            where: { id },
        });
        return salesInvoice;
    }
    catch (error) {
        console.error('Error fetching Sales Invoice:', error);
        throw new Error('Failed to fetch Sales Invoice');
    }
});
exports.getSalesInvoiceByIdService = getSalesInvoiceByIdService;
// Update a Sales Invoice
const updateSalesInvoiceService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSalesInvoice = yield prisma.salesInvoice.update({
            where: { id },
            data: {
                amount: data.amount,
                status: data.status,
            },
        });
        return updatedSalesInvoice;
    }
    catch (error) {
        console.error('Error updating Sales Invoice:', error);
        throw new Error('Failed to update Sales Invoice');
    }
});
exports.updateSalesInvoiceService = updateSalesInvoiceService;
// Delete a Sales Invoice
const deleteSalesInvoiceService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSalesInvoice = yield prisma.salesInvoice.delete({
            where: { id },
        });
        return !!deletedSalesInvoice; // Return true if deletion was successful
    }
    catch (error) {
        console.error('Error deleting Sales Invoice:', error);
        throw new Error('Failed to delete Sales Invoice');
    }
});
exports.deleteSalesInvoiceService = deleteSalesInvoiceService;
