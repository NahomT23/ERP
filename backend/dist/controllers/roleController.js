"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacture_only = exports.inventory_only = exports.sales_only = exports.admin_only = void 0;
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.admin_only = [
    authMiddleware_1.authentication,
    (0, authMiddleware_1.authorize)([client_1.UserRole.ADMIN]),
    (req, res) => {
        res.status(200).json({ message: 'This is an admin-only route' });
    },
];
exports.sales_only = [
    authMiddleware_1.authentication,
    (0, authMiddleware_1.authorize)([client_1.UserRole.SALES_REPRESENTATIVE]),
    (req, res) => {
        res.status(200).json({ message: 'This is a sales-only route' });
    },
];
exports.inventory_only = [
    authMiddleware_1.authentication,
    (0, authMiddleware_1.authorize)([client_1.UserRole.INVENTORY_MANAGER]),
    (req, res) => {
        res.status(200).json({ message: 'This is an inventory-only route' });
    },
];
exports.manufacture_only = [
    authMiddleware_1.authentication,
    (0, authMiddleware_1.authorize)([client_1.UserRole.MANUFACTURING_MANAGER]),
    (req, res) => {
        res.status(200).json({ message: 'This is a manufacturing-only route' });
    },
];
