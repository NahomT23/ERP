import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { isEmail } from 'validator';
import { ExpressRequest } from '../middlewares/authMiddleware';

// Create a company and an admin user
export const createCompanyAndAdmin = async (req: ExpressRequest, res: Response): Promise<void> => {
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
    if (!isEmail(adminEmail)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    // Check if the company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName },
    });

    if (existingCompany) {
      res.status(400).json({ message: 'Company name is already in use' });
      return;
    }

    // Check if the admin email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      res.status(400).json({ message: 'Admin email is already in use' });
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the company
    const company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });

    // Create the admin user associated with the company
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        password: hashedPassword,
        role: UserRole.ADMIN, // Set the role to ADMIN
        status: 'active', // Set the status to active
        companyId: company.id, // Associate the user with the company
      },
    });

    // Create an audit log for company and admin creation
    await prisma.auditLog.create({
      data: {
        action: 'create_company_and_admin',
        resourceType: 'Company',
        resourceId: company.id,
        details: 'Company and admin user created successfully',
        createdByUserId: adminUser.id,
      },
    });

    res.status(201).json({ message: 'Company and admin user created successfully', company, adminUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};