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
exports.getAuditLogs = exports.logout = exports.getMe = exports.signin = exports.signup = void 0;
const authService_1 = require("../../services/authService/authService");
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authService_2 = require("../../services/authService/authService");
const validator_1 = require("validator");
const client_1 = require("@prisma/client");
const authService_3 = require("../../services/authService/authService");
const authMiddleware_1 = require("../../middlewares/authMiddleware/authMiddleware");
// const signupLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Too many signup attempts, please try again later.');
const signupLimiter = (0, authService_1.createRateLimiter)(1 * 60 * 1000, 3, 'Too many signup attempts, please try again later.');
const signinLimiter = (0, authService_1.createRateLimiter)(5 * 60 * 1000, 5, 'Too many login attempts, please try again later.');
exports.signup = [
    signupLimiter,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password, email, username, role, companyName } = req.body;
            if (!password || !email || !username || !companyName) {
                res.status(400).json({ message: 'Email, username, password, and company name are required' });
                return;
            }
            if (password.length < 6) {
                res.status(400).json({ message: 'Password must be at least 6 characters long' });
                return;
            }
            if (!(0, validator_1.isEmail)(email)) {
                res.status(400).json({ message: 'Invalid email format' });
                return;
            }
            // Check if the company exists
            let company = yield prisma_1.default.company.findUnique({
                where: { name: companyName },
            });
            // If the company doesn't exist, create a new one
            if (!company) {
                company = yield prisma_1.default.company.create({
                    data: { name: companyName },
                });
            }
            const existingUser = yield prisma_1.default.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                res.status(400).json({ message: 'Email is already in use' });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield prisma_1.default.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    role: role || 'SALES_REPRESENTATIVE',
                    status: 'inactive', // Set the status to inactive
                    companyId: company.id, // Associate with the company
                },
            });
            // Create an audit log for sign-up
            yield prisma_1.default.auditLog.create({
                data: {
                    action: 'sign_up',
                    resourceType: 'User',
                    resourceId: user.id,
                    details: 'User signed up successfully',
                    createdByUserId: user.id,
                },
            });
            res.status(201).json({ message: 'Signup successful. Await admin approval.' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error, please try again later' });
        }
    }),
];
exports.signin = [
    signinLimiter,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, companyName } = req.body;
            if (!email || !password || !companyName) {
                res.status(400).json({ message: 'Email, password, and company name are required' });
                return;
            }
            // Fetch the company by name
            const company = yield prisma_1.default.company.findUnique({
                where: { name: companyName },
            });
            if (!company) {
                res.status(404).json({ message: 'Company not found' });
                return;
            }
            // Fetch the user by email and ensure they belong to the specified company
            const user = yield prisma_1.default.user.findUnique({
                where: { email },
                include: {
                    company: true, // Include company to check if the user belongs to the specified company
                },
            });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            // Ensure the user is in the specified company
            if (user.company.name !== companyName) {
                res.status(403).json({ message: 'User does not belong to the specified company' });
                return;
            }
            // Check if the account is locked
            if (yield (0, authService_3.isAccountLocked)(email)) {
                res.status(403).json({ message: 'Account is locked. Please try again later.' });
                return;
            }
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                yield (0, authService_3.handleFailedLogin)(email);
                res.status(400).json({ message: 'Incorrect password' });
                return;
            }
            // Reset failed attempts on successful login
            yield (0, authService_3.resetFailedAttempts)(email);
            // Create an audit log for sign in
            yield prisma_1.default.auditLog.create({
                data: {
                    action: 'sign_in',
                    resourceType: 'User',
                    resourceId: user.id,
                    details: 'User signed in successfully',
                    createdByUserId: user.id,
                },
            });
            // res.status(200).json({ message: 'Signed in successfully', token: generateJwt(user) });
            res.status(200).json({
                message: 'Signed in successfully',
                token: (0, authService_2.generateJwt)(user),
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role, // Include the role
                    status: user.status, // Include the status
                    companyId: user.companyId, // Include the company ID
                },
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred during signin' });
        }
    }),
];
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        res.status(200).json(req.user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user data' });
    }
});
exports.getMe = getMe;
const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
exports.getAuditLogs = [
    authMiddleware_1.authentication,
    (0, authMiddleware_1.authorize)([client_1.UserRole.ADMIN]),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const logs = yield prisma_1.default.auditLog.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            res.status(200).json(logs);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving audit logs' });
        }
    }),
];
