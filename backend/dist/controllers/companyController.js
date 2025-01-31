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
exports.createCompanyAndAdmin = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const validator_1 = require("validator");
// Create a company and an admin user
const createCompanyAndAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, adminEmail, adminUsername, adminPassword } = req.body;
        // Validate required fields
        if (!companyName || !adminEmail || !adminUsername || !adminPassword) {
            res.status(400).json({ message: 'Company name, admin email, username, and password are required' });
            return;
        }
        // Validate password length
        if (adminPassword.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }
        // Validate email format
        if (!(0, validator_1.isEmail)(adminEmail)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        // Check if the company already exists
        const existingCompany = yield prisma_1.default.company.findUnique({
            where: { name: companyName },
        });
        if (existingCompany) {
            res.status(400).json({ message: 'Company name is already in use' });
            return;
        }
        // Check if the admin email is already in use
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email: adminEmail },
        });
        if (existingUser) {
            res.status(400).json({ message: 'Admin email is already in use' });
            return;
        }
        // Hash the admin password
        const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
        // Create the company
        const company = yield prisma_1.default.company.create({
            data: {
                name: companyName,
            },
        });
        // Create the admin user associated with the company
        const adminUser = yield prisma_1.default.user.create({
            data: {
                email: adminEmail,
                username: adminUsername,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN, // Set the role to ADMIN
                status: 'active', // Set the status to active
                companyId: company.id, // Associate the user with the company
            },
        });
        // Create an audit log for company and admin creation
        yield prisma_1.default.auditLog.create({
            data: {
                action: 'create_company_and_admin',
                resourceType: 'Company',
                resourceId: company.id,
                details: 'Company and admin user created successfully',
                createdByUserId: adminUser.id,
            },
        });
        res.status(201).json({ message: 'Company and admin user created successfully', company, adminUser });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});
exports.createCompanyAndAdmin = createCompanyAndAdmin;
