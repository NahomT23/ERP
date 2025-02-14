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
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const customerService_1 = require("../../services/salesService/customerService");
// Create a new Customer
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerData = req.body;
        const customer = yield (0, customerService_1.createCustomerService)(customerData);
        res.status(201).json({ message: 'Customer created successfully', data: customer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating Customer', error: error });
    }
});
exports.createCustomer = createCustomer;
// Get all Customers
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield (0, customerService_1.getCustomersService)();
        res.status(200).json({ message: 'Customers retrieved successfully', data: customers });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving Customers', error: error });
    }
});
exports.getCustomers = getCustomers;
// Get a single Customer by ID
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const customer = yield (0, customerService_1.getCustomerByIdService)(id);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json({ message: 'Customer retrieved successfully', data: customer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving Customer', error: error });
    }
});
exports.getCustomerById = getCustomerById;
// Update a Customer
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const customer = yield (0, customerService_1.updateCustomerService)(id, updatedData);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json({ message: 'Customer updated successfully', data: customer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating Customer', error: error });
    }
});
exports.updateCustomer = updateCustomer;
// Delete a Customer
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const customer = yield (0, customerService_1.deleteCustomerService)(id);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting Customer', error: error });
    }
});
exports.deleteCustomer = deleteCustomer;
