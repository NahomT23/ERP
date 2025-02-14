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
exports.authorize = exports.authentication = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../../prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Token not found' });
        return;
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: decoded.email,
            },
            include: {
                company: true, // Fetch company details as well
            },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Skip the active status check for admins
        if (user.role !== client_1.UserRole.ADMIN && user.status !== 'active') {
            res.status(403).json({ message: 'Account is not yet active. Please wait for admin approval.' });
            return;
        }
        req.user = user; // Attach user to the request object
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        }
        else {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
});
exports.authentication = authentication;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userRole = req.user.role.toUpperCase();
        const allowedRoles = roles.map(role => role.toUpperCase());
        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
