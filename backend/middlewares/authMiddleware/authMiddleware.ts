import { User, UserRole } from '@prisma/client';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import prisma from '../../prisma';
import { NextFunction, Response, Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export interface ExpressRequest extends Request {
  user?: User;
}

export const authentication = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Token not found' });
    return;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { email: string };
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
      include: {
        company: true,  // Fetch company details as well
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Skip the active status check for admins
    if (user.role !== UserRole.ADMIN && user.status !== 'active') {
      res.status(403).json({ message: 'Account is not yet active. Please wait for admin approval.' });
      return;
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};


export const authorize = (roles: UserRole[]) => {
  return (req: ExpressRequest, res: Response, next: NextFunction): void => {
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
