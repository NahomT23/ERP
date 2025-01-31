import express from 'express';
import { signup, signin, getMe, logout, getAuditLogs } from '../controllers/authController';
import { authentication } from '../middlewares/authMiddleware';
import { admin_only, inventory_only, manufacture_only, sales_only } from '../controllers/roleController';
import { approveUser } from '../controllers/adminController'; // Import the new approveUser function
import { createCompanyAndAdmin } from '../controllers/companyController';




const router = express.Router();

//  SIGN IN AND SIGN UP
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', authentication, logout);

// GET LOGGED IN USER PROFILE
router.get('/me', authentication, getMe);


// PROTECTED ROUTES
router.get('/admin-only', admin_only);
router.get('/sales-only', sales_only); 
router.get("/inventory-only", inventory_only)
router.get("/manufacture-only", manufacture_only)

// FOR THE ADMIN TO GET ALL THE LOGS COMMITTED BY ALL THE USERS
router.get('/admin-audit-logs', getAuditLogs)


// ADMIN CONFIRMATION ROUTE
router.post('/admin/approve-user', authentication, approveUser); 


// CREATE COMPANY AND ADMIN

router.post('/admin/create-company', createCompanyAndAdmin)

export default router;
