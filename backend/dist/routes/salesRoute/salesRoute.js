"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware/authMiddleware");
const authMiddleware_2 = require("../../middlewares/authMiddleware/authMiddleware");
const client_1 = require("@prisma/client");
const salesLeadController_1 = require("../../controllers/salesController/salesLeadController");
const salesOrderController_1 = require("../../controllers/salesController/salesOrderController");
const salesInvoiceController_1 = require("../../controllers/salesController/salesInvoiceController");
const salesCommunicationController_1 = require("../../controllers/salesController/salesCommunicationController");
const customerController_1 = require("../../controllers/salesController/customerController");
const quotationController_1 = require("../../controllers/salesController/quotationController");
const router = express_1.default.Router();
// Middleware to restrict access to Sales Representatives only
const sales_only = [authMiddleware_1.authentication, (0, authMiddleware_2.authorize)([client_1.UserRole.SALES_REPRESENTATIVE])];
/**
 * Sales Leads Routes
 */
router.post('/leads', sales_only, salesLeadController_1.createSalesLead); // Create a new Sales Lead
router.get('/leads', sales_only, salesLeadController_1.getSalesLeads); // Get all Sales Leads
router.get('/leads/:id', sales_only, salesLeadController_1.getSalesLeadById); // Get a single Sales Lead by ID
router.put('/leads/:id', sales_only, salesLeadController_1.updateSalesLead); // Update a Sales Lead
router.delete('/leads/:id', sales_only, salesLeadController_1.deleteSalesLead); // Delete a Sales Lead
// 
router.post('/leads/:leadId/communication-logs', sales_only, salesCommunicationController_1.addCommunicationLog); // Add a communication log to a Sales Lead
router.get('/leads/:leadId/communication-logs', sales_only, salesCommunicationController_1.getCommunicationLogsForLead); // Get all communication logs for a Sales Lead
router.put('/communication-logs/:logId', sales_only, salesCommunicationController_1.updateCommunicationLog); // Update a communication log
router.delete('/communication-logs/:logId', sales_only, salesCommunicationController_1.deleteCommunicationLog); // Delete a communication log
/**
 * Sales Orders Routes
 */
router.post('/orders', sales_only, salesOrderController_1.createSalesOrder); // Create a new Sales Order
router.get('/orders', sales_only, salesOrderController_1.getSalesOrders); // Get all Sales Orders
router.get('/orders/:id', sales_only, salesOrderController_1.getSalesOrderById); // Get a single Sales Order by ID
router.put('/orders/:id', sales_only, salesOrderController_1.updateSalesOrder); // Update a Sales Order
router.delete('/orders/:id', sales_only, salesOrderController_1.deleteSalesOrder); // Delete a Sales Order
/**
 * Sales Invoices Routes
 */
router.post('/invoices', sales_only, salesInvoiceController_1.createSalesInvoice); // Create a new Sales Invoice
router.get('/invoices', sales_only, salesInvoiceController_1.getSalesInvoices); // Get all Sales Invoices
router.get('/invoices/:id', sales_only, salesInvoiceController_1.getSalesInvoiceById); // Get a single Sales Invoice by ID
router.put('/invoices/:id', sales_only, salesInvoiceController_1.updateSalesInvoice); // Update a Sales Invoice
router.delete('/invoices/:id', sales_only, salesInvoiceController_1.deleteSalesInvoice); // Delete a Sales Invoice
router.post('/customers', customerController_1.createCustomer); // Create a new Customer
router.get('/customers', customerController_1.getCustomers); // Get all Customers
router.get('/customers/:id', customerController_1.getCustomerById); // Get a single Customer by ID
router.put('/customers/:id', customerController_1.updateCustomer); // Update a Customer
router.delete('/customers/:id', customerController_1.deleteCustomer); // Delete a Customer
router.post('/quotations', sales_only, quotationController_1.createQuotation); // Create a new Quotation
router.get('/quotations', sales_only, quotationController_1.getQuotations); // Get all Quotations
router.get('/quotations/:id', sales_only, quotationController_1.getQuotationById); // Get a single Quotation by ID
router.put('/quotations/:id', sales_only, quotationController_1.updateQuotation); // Update a Quotation
router.delete('/quotations/:id', sales_only, quotationController_1.deleteQuotation); // Delete a Quotation
exports.default = router;
