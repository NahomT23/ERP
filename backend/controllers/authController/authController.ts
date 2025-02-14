import { Request, Response } from 'express';
import { createRateLimiter } from '../../services/authService/authService';
import prisma from '../../prisma';
import bcrypt from 'bcryptjs';
import { generateJwt } from '../../services/authService/authService';
import { isEmail } from 'validator';

import { UserRole } from '@prisma/client';
import { handleFailedLogin, isAccountLocked, resetFailedAttempts } from '../../services/authService/authService';
import { authentication, authorize, ExpressRequest } from '../../middlewares/authMiddleware/authMiddleware';
  

// const signupLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Too many signup attempts, please try again later.');

const signupLimiter = createRateLimiter(1 * 60 * 1000, 3, 'Too many signup attempts, please try again later.');


const signinLimiter = createRateLimiter(5 * 60 * 1000, 5, 'Too many login attempts, please try again later.');


export const signup = [
  signupLimiter,
  async (req: ExpressRequest, res: Response): Promise<void> => {
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
    
      if (!isEmail(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }
    
      // Check if the company exists
      let company = await prisma.company.findUnique({
        where: { name: companyName },
      });
    
      // If the company doesn't exist, create a new one
      if (!company) {
        company = await prisma.company.create({
          data: { name: companyName },
        });
      }
    
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
    
      if (existingUser) {
        res.status(400).json({ message: 'Email is already in use' });
        return;
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: role || 'SALES_REPRESENTATIVE',
          status: 'inactive',  // Set the status to inactive
          companyId: company.id,  // Associate with the company
        },
      });
    
      // Create an audit log for sign-up
      await prisma.auditLog.create({
        data: {
          action: 'sign_up',
          resourceType: 'User',
          resourceId: user.id,
          details: 'User signed up successfully',
          createdByUserId: user.id,
        },
      });
    
      res.status(201).json({ message: 'Signup successful. Await admin approval.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  },
];


export const signin = [
  signinLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, companyName } = req.body;

      if (!email || !password || !companyName) {
        res.status(400).json({ message: 'Email, password, and company name are required' });
        return;
      }

      // Fetch the company by name
      const company = await prisma.company.findUnique({
        where: { name: companyName },
      });

      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }

      // Fetch the user by email and ensure they belong to the specified company
      const user = await prisma.user.findUnique({
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
      if (await isAccountLocked(email)) {
        res.status(403).json({ message: 'Account is locked. Please try again later.' });
        return;
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        await handleFailedLogin(email);
        res.status(400).json({ message: 'Incorrect password' });
        return;
      }

      // Reset failed attempts on successful login
      await resetFailedAttempts(email);

      // Create an audit log for sign in
      await prisma.auditLog.create({
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
        token: generateJwt(user),
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role, // Include the role
          status: user.status, // Include the status
          companyId: user.companyId, // Include the company ID
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred during signin' });
    }
  },
];


export const getMe = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      res.status(200).json(req.user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving user data' });
    }
};

export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getAuditLogs = [
    authentication,
    authorize([UserRole.ADMIN]),
    async (req: ExpressRequest, res: Response): Promise<void> => {
      try {
        const logs = await prisma.auditLog.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.status(200).json(logs);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving audit logs' });
      }
    },
];
  
  