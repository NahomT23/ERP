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
exports.deleteSalesOrder = exports.updateSalesOrder = exports.getSalesOrderById = exports.getSalesOrders = exports.createSalesOrder = void 0;
const client_1 = require("@prisma/client");
const salesOrderService_1 = require("../../services/salesService/salesOrderService");
// export const createSalesOrder = async (req: ExpressRequest, res: Response): Promise<void> => {
//   try {
//     const { quotationId, totalAmount, status, salesLeadId, customerId } = req.body;
//     // Extract the authenticated user's ID (assuming it's available in the request)
//     const createdByUserId = req.user?.id; // Adjust this based on your authentication setup
//     if (!quotationId || !totalAmount || !status || !salesLeadId || !createdByUserId) {
//       res.status(400).json({ error: 'Missing required fields' });
//       return;
//     }
//     // Validate status against the SalesOrderStatus enum
//     let parsedStatus: SalesOrderStatus;
//     if (status === 'PENDING') {
//       parsedStatus = SalesOrderStatus.PENDING;
//     } else if (status === 'COMPLETED') {
//       parsedStatus = SalesOrderStatus.COMPLETED;
//     } else {
//       res.status(400).json({ error: 'Invalid status value' });
//       return;
//     }
//     const salesOrder = await createSalesOrderService({
//       quotationId,
//       totalAmount,
//       status: parsedStatus,
//       salesLeadId,
//       customerId,
//       createdByUserId: ''
//     });
//     res.status(201).json(salesOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// Get all Sales Orders
const createSalesOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { quotationId, totalAmount, status, salesLeadId, customerId } = req.body;
        // Extract the authenticated user's ID
        const createdByUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdByUserId) {
            res.status(401).json({ error: 'Unauthorized: User ID is missing' });
            return;
        }
        // Validate required fields
        if (!quotationId || !totalAmount || !status || !salesLeadId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Validate status
        let parsedStatus;
        if (status === 'PENDING') {
            parsedStatus = client_1.SalesOrderStatus.PENDING;
        }
        else if (status === 'COMPLETED') {
            parsedStatus = client_1.SalesOrderStatus.COMPLETED;
        }
        else {
            res.status(400).json({ error: 'Invalid status value' });
            return;
        }
        // Call the service
        const salesOrder = yield (0, salesOrderService_1.createSalesOrderService)({
            quotationId,
            totalAmount,
            status: parsedStatus,
            salesLeadId,
            customerId,
            createdByUserId,
        });
        res.status(201).json(salesOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createSalesOrder = createSalesOrder;
const getSalesOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesOrders = yield (0, salesOrderService_1.getSalesOrdersService)();
        res.status(200).json(salesOrders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getSalesOrders = getSalesOrders;
// Get a single Sales Order by ID
const getSalesOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const salesOrder = yield (0, salesOrderService_1.getSalesOrderByIdService)(parseInt(id, 10));
        if (!salesOrder) {
            res.status(404).json({ error: 'Sales Order not found' });
            return;
        }
        res.status(200).json(salesOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getSalesOrderById = getSalesOrderById;
// Update a Sales Order
const updateSalesOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { totalAmount, status, customerId } = req.body;
        let parsedStatus;
        if (status) {
            if (status === 'PENDING') {
                parsedStatus = client_1.SalesOrderStatus.PENDING;
            }
            else if (status === 'COMPLETED') {
                parsedStatus = client_1.SalesOrderStatus.COMPLETED;
            }
            else {
                res.status(400).json({ error: 'Invalid status value' });
                return;
            }
        }
        const updatedSalesOrder = yield (0, salesOrderService_1.updateSalesOrderService)(parseInt(id, 10), {
            totalAmount,
            status: parsedStatus,
            customerId,
        });
        if (!updatedSalesOrder) {
            res.status(404).json({ error: 'Sales Order not found' });
            return;
        }
        res.status(200).json(updatedSalesOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateSalesOrder = updateSalesOrder;
// Delete a Sales Order
const deleteSalesOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const success = yield (0, salesOrderService_1.deleteSalesOrderService)(parseInt(id, 10));
        if (!success) {
            res.status(404).json({ error: 'Sales Order not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteSalesOrder = deleteSalesOrder;
