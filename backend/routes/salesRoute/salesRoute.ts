import express from 'express';
import { authentication } from '../../middlewares/authMiddleware/authMiddleware';
import { authorize } from '../../middlewares/authMiddleware/authMiddleware';
import { UserRole } from '@prisma/client';
import { createSalesLead, deleteSalesLead, getSalesLeadById, getSalesLeads, updateSalesLead } from '../../controllers/salesController/salesLeadController';
import { createSalesOrder, deleteSalesOrder, getSalesOrderById, getSalesOrders, updateSalesOrder } from '../../controllers/salesController/salesOrderController';
import { createSalesInvoice, deleteSalesInvoice, getSalesInvoiceById, getSalesInvoices, updateSalesInvoice } from '../../controllers/salesController/salesInvoiceController';
import { addCommunicationLog, deleteCommunicationLog, getCommunicationLogsForLead, updateCommunicationLog } from '../../controllers/salesController/salesCommunicationController';
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from '../../controllers/salesController/customerController';
import { createQuotation, deleteQuotation, getQuotationById, getQuotations, updateQuotation } from '../../controllers/salesController/quotationController';

const router = express.Router();

// Middleware to restrict access to Sales Representatives only
const sales_only = [authentication, authorize([UserRole.SALES_REPRESENTATIVE])];

/**
 * Sales Leads Routes
 */
router.post('/leads', sales_only, createSalesLead); // Create a new Sales Lead
router.get('/leads', sales_only, getSalesLeads); // Get all Sales Leads
router.get('/leads/:id', sales_only, getSalesLeadById); // Get a single Sales Lead by ID
router.put('/leads/:id', sales_only, updateSalesLead); // Update a Sales Lead
router.delete('/leads/:id', sales_only, deleteSalesLead); // Delete a Sales Lead

// 


router.post('/leads/:leadId/communication-logs', sales_only, addCommunicationLog); // Add a communication log to a Sales Lead
router.get('/leads/:leadId/communication-logs', sales_only, getCommunicationLogsForLead); // Get all communication logs for a Sales Lead
router.put('/communication-logs/:logId', sales_only, updateCommunicationLog); // Update a communication log
router.delete('/communication-logs/:logId', sales_only, deleteCommunicationLog); // Delete a communication log


/**
 * Sales Orders Routes
 */
router.post('/orders', sales_only, createSalesOrder); // Create a new Sales Order
router.get('/orders', sales_only, getSalesOrders); // Get all Sales Orders
router.get('/orders/:id', sales_only, getSalesOrderById); // Get a single Sales Order by ID
router.put('/orders/:id', sales_only, updateSalesOrder); // Update a Sales Order
router.delete('/orders/:id', sales_only, deleteSalesOrder); // Delete a Sales Order

/**
 * Sales Invoices Routes
 */
router.post('/invoices', sales_only, createSalesInvoice); // Create a new Sales Invoice
router.get('/invoices', sales_only, getSalesInvoices); // Get all Sales Invoices
router.get('/invoices/:id', sales_only, getSalesInvoiceById); // Get a single Sales Invoice by ID
router.put('/invoices/:id', sales_only, updateSalesInvoice); // Update a Sales Invoice
router.delete('/invoices/:id', sales_only, deleteSalesInvoice); // Delete a Sales Invoice




router.post('/customers', createCustomer); // Create a new Customer
router.get('/customers', getCustomers); // Get all Customers
router.get('/customers/:id', getCustomerById); // Get a single Customer by ID
router.put('/customers/:id', updateCustomer); // Update a Customer
router.delete('/customers/:id', deleteCustomer); // Delete a Customer


router.post('/quotations', sales_only, createQuotation); // Create a new Quotation
router.get('/quotations', sales_only, getQuotations); // Get all Quotations
router.get('/quotations/:id', sales_only, getQuotationById); // Get a single Quotation by ID
router.put('/quotations/:id', sales_only, updateQuotation); // Update a Quotation
router.delete('/quotations/:id', sales_only, deleteQuotation); // Delete a Quotation


export default router;




