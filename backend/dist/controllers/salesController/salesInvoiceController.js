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
exports.deleteSalesInvoice = exports.updateSalesInvoice = exports.getSalesInvoiceById = exports.getSalesInvoices = exports.createSalesInvoice = void 0;
const client_1 = require("@prisma/client");
const salesInvoiceService_1 = require("../../services/salesService/salesInvoiceService");
// Create a new Sales Invoice
const createSalesInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesOrderId, amount, status } = req.body;
        // Validate required fields
        if (!salesOrderId || !amount || !status) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Validate status against the SalesInvoiceStatus enum
        let parsedStatus;
        if (status === 'PAID') {
            parsedStatus = client_1.SalesInvoiceStatus.PAID;
        }
        else if (status === 'UNPAID') {
            parsedStatus = client_1.SalesInvoiceStatus.UNPAID;
        }
        else {
            res.status(400).json({ error: 'Invalid status value' });
            return;
        }
        const salesInvoice = yield (0, salesInvoiceService_1.createSalesInvoiceService)({
            salesOrderId,
            amount,
            status: parsedStatus,
        });
        res.status(201).json(salesInvoice);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createSalesInvoice = createSalesInvoice;
// Get all Sales Invoices
const getSalesInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesInvoices = yield (0, salesInvoiceService_1.getSalesInvoicesService)();
        res.status(200).json(salesInvoices);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getSalesInvoices = getSalesInvoices;
// Get a single Sales Invoice by ID
const getSalesInvoiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const salesInvoice = yield (0, salesInvoiceService_1.getSalesInvoiceByIdService)(parseInt(id, 10));
        if (!salesInvoice) {
            res.status(404).json({ error: 'Sales Invoice not found' });
            return;
        }
        res.status(200).json(salesInvoice);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getSalesInvoiceById = getSalesInvoiceById;
// Update a Sales Invoice
const updateSalesInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, status } = req.body;
        let parsedStatus;
        if (status) {
            if (status === 'PAID') {
                parsedStatus = client_1.SalesInvoiceStatus.PAID;
            }
            else if (status === 'UNPAID') {
                parsedStatus = client_1.SalesInvoiceStatus.UNPAID;
            }
            else {
                res.status(400).json({ error: 'Invalid status value' });
                return;
            }
        }
        const updatedSalesInvoice = yield (0, salesInvoiceService_1.updateSalesInvoiceService)(parseInt(id, 10), {
            amount,
            status: parsedStatus,
        });
        if (!updatedSalesInvoice) {
            res.status(404).json({ error: 'Sales Invoice not found' });
            return;
        }
        res.status(200).json(updatedSalesInvoice);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateSalesInvoice = updateSalesInvoice;
// Delete a Sales Invoice
const deleteSalesInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const success = yield (0, salesInvoiceService_1.deleteSalesInvoiceService)(parseInt(id, 10));
        if (!success) {
            res.status(404).json({ error: 'Sales Invoice not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteSalesInvoice = deleteSalesInvoice;
