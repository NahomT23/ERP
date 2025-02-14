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
exports.deleteSalesInvoiceService = exports.updateSalesInvoiceService = exports.getSalesInvoiceByIdService = exports.getSalesInvoicesService = exports.createSalesInvoiceService = exports.deleteSalesOrderService = exports.updateSalesOrderService = exports.getSalesOrderByIdService = exports.getSalesOrdersService = exports.createSalesOrderService = exports.deleteCommunicationLogService = exports.updateCommunicationLogService = exports.getCommunicationLogsForLeadService = exports.addCommunicationLogService = exports.deleteSalesLeadService = exports.updateSalesLeadService = exports.getSalesLeadByIdService = exports.getSalesLeadsService = exports.createSalesLeadService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
/**
 * Sales Lead Services
 */
const createSalesLeadService = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesLead.create({
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
});
exports.createSalesLeadService = createSalesLeadService;
const getSalesLeadsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesLead.findMany({
        include: {
            customer: true,
            communicationLogs: true,
            createdByUser: true,
        },
    });
});
exports.getSalesLeadsService = getSalesLeadsService;
const getSalesLeadByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesLead.findUnique({
        where: { id },
        include: {
            customer: true,
            communicationLogs: true,
            createdByUser: true,
        },
    });
});
exports.getSalesLeadByIdService = getSalesLeadByIdService;
const updateSalesLeadService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesLead.update({
        where: { id },
        data,
    });
});
exports.updateSalesLeadService = updateSalesLeadService;
const deleteSalesLeadService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesLead.delete({
        where: { id },
    });
});
exports.deleteSalesLeadService = deleteSalesLeadService;
// Communication Log Services
const addCommunicationLogService = (leadId, description) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.communicationLog.create({
        data: { leadId, description },
    });
});
exports.addCommunicationLogService = addCommunicationLogService;
const getCommunicationLogsForLeadService = (leadId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.communicationLog.findMany({
        where: { leadId },
    });
});
exports.getCommunicationLogsForLeadService = getCommunicationLogsForLeadService;
const updateCommunicationLogService = (logId, description) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.communicationLog.update({
        where: { id: logId },
        data: { description },
    });
});
exports.updateCommunicationLogService = updateCommunicationLogService;
const deleteCommunicationLogService = (logId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.communicationLog.delete({
        where: { id: logId },
    });
});
exports.deleteCommunicationLogService = deleteCommunicationLogService;
// Sales Order Services
const createSalesOrderService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesOrder.create({ data });
});
exports.createSalesOrderService = createSalesOrderService;
const getSalesOrdersService = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesOrder.findMany({
        include: { customer: true, salesLead: true, salesInvoices: true },
    });
});
exports.getSalesOrdersService = getSalesOrdersService;
const getSalesOrderByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesOrder.findUnique({
        where: { id },
        include: { customer: true, salesLead: true, salesInvoices: true },
    });
});
exports.getSalesOrderByIdService = getSalesOrderByIdService;
const updateSalesOrderService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesOrder.update({ where: { id }, data });
});
exports.updateSalesOrderService = updateSalesOrderService;
const deleteSalesOrderService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesOrder.delete({ where: { id } });
});
exports.deleteSalesOrderService = deleteSalesOrderService;
// Sales Invoice Services
const createSalesInvoiceService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesInvoice.create({ data });
});
exports.createSalesInvoiceService = createSalesInvoiceService;
const getSalesInvoicesService = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesInvoice.findMany({
        include: { salesOrder: true },
    });
});
exports.getSalesInvoicesService = getSalesInvoicesService;
const getSalesInvoiceByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesInvoice.findUnique({
        where: { id },
        include: { salesOrder: true },
    });
});
exports.getSalesInvoiceByIdService = getSalesInvoiceByIdService;
const updateSalesInvoiceService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesInvoice.update({ where: { id }, data });
});
exports.updateSalesInvoiceService = updateSalesInvoiceService;
const deleteSalesInvoiceService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.salesInvoice.delete({ where: { id } });
});
exports.deleteSalesInvoiceService = deleteSalesInvoiceService;
