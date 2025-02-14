import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { authentication, authorize, ExpressRequest } from '../../middlewares/authMiddleware/authMiddleware';

export const admin_only = [
  authentication,
  authorize([UserRole.ADMIN]),
  (req: ExpressRequest, res: Response) => {
    res.status(200).json({ message: 'This is an admin-only route' });
  },
];

export const sales_only = [
  authentication,
  authorize([UserRole.SALES_REPRESENTATIVE]),
  (req: ExpressRequest, res: Response) => {
    res.status(200).json({ message: 'This is a sales-only route' });
  },
];

export const inventory_only = [
  authentication,
  authorize([UserRole.INVENTORY_MANAGER]),
  (req: ExpressRequest, res: Response) => {
    res.status(200).json({ message: 'This is an inventory-only route' });
  },
];

export const customer_only = [
  authentication,
  authorize([UserRole.CUSTOMER]),
  (req: ExpressRequest, res: Response) => {
    res.status(200).json({ message: 'This is an inventory-only route' });
  },
];

export const manufacture_only = [
  authentication,
  authorize([UserRole.MANUFACTURING_MANAGER]),
  (req: ExpressRequest, res: Response) => {
    res.status(200).json({ message: 'This is a manufacturing-only route' });
  },
];
