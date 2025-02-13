"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controllers/authController/authController");
const authMiddleware_1 = require("../../middlewares/authMiddleware/authMiddleware");
const roleController_1 = require("../../controllers/roleController/roleController");
const adminController_1 = require("../../controllers/adminController/adminController");
const companyController_1 = require("../../controllers/companyController/companyController");
const router = express_1.default.Router();
//  SIGN IN AND SIGN UP
router.post('/signup', authController_1.signup);
router.post('/signin', authController_1.signin);
router.post('/logout', authMiddleware_1.authentication, authController_1.logout);
// GET LOGGED IN USER PROFILE
router.get('/me', authMiddleware_1.authentication, authController_1.getMe);
// PROTECTED ROUTES
router.get('/admin-only', roleController_1.admin_only);
router.get('/sales-only', roleController_1.sales_only);
router.get("/inventory-only", roleController_1.inventory_only);
router.get("/manufacture-only", roleController_1.manufacture_only);
router.get("/customer-only", roleController_1.customer_only);
// FOR THE ADMIN TO GET ALL THE LOGS COMMITTED BY ALL THE USERS
router.get('/admin-audit-logs', authController_1.getAuditLogs);
// ADMIN CONFIRMATION ROUTE
// ADD THE ADMIN ONLY ROLE BASED AT THE END!!
router.post('/admin/approve-user', authMiddleware_1.authentication, adminController_1.approveUser);
router.post('/admin/deactivate-user', authMiddleware_1.authentication, adminController_1.deactivateUser);
// CREATE COMPANY AND ADMIN
router.post('/admin/create-company', companyController_1.createCompanyAndAdmin);
exports.default = router;
