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
exports.deleteCustomerService = exports.updateCustomerService = exports.getCustomerByIdService = exports.getCustomersService = exports.createCustomerService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
// Create a new Customer
const createCustomerService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.name || !data.email) {
        throw new Error('Missing required fields: name or email');
    }
    return yield prisma_1.default.customer.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            address: data.address || undefined,
        },
    });
});
exports.createCustomerService = createCustomerService;
// Get all Customers
const getCustomersService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.customer.findMany();
});
exports.getCustomersService = getCustomersService;
// Get a single Customer by ID
const getCustomerByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.customer.findUnique({
        where: { id },
    });
});
exports.getCustomerByIdService = getCustomerByIdService;
// Update a Customer
const updateCustomerService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.customer.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            address: data.address || undefined,
        },
    });
});
exports.updateCustomerService = updateCustomerService;
// Delete a Customer
const deleteCustomerService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.customer.delete({
        where: { id },
    });
});
exports.deleteCustomerService = deleteCustomerService;
