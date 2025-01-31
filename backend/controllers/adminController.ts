import { UserRole } from "@prisma/client";
import { Response } from 'express';
import prisma from '../prisma';
import { ExpressRequest } from "../middlewares/authMiddleware";


export const approveUser = async (req: ExpressRequest, res: Response): Promise<void> => {
    const { userId } = req.body;
  
    // Check if the logged-in user is the admin of the company
    if (req.user?.role !== UserRole.ADMIN) {
      res.status(403).json({ message: 'You are not authorized to approve users' });
      return;
    }
  
    // Check if the user to be approved is in the same company
    const userToApprove = await prisma.user.findUnique({ where: { id: userId } });
  
    if (!userToApprove) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
  
    if (userToApprove.companyId !== req.user.companyId) {
      res.status(403).json({ message: 'You can only approve users from your company' });
      return;
    }
  
    // Update the user status to active
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: 'active' },
    });
  
    // Create an audit log for user approval
    await prisma.auditLog.create({
      data: {
        action: 'approve_user',
        resourceType: 'User',
        resourceId: updatedUser.id,
        details: 'User approved and set to active',
        createdByUserId: req.user.id,
      },
    });
  
    res.status(200).json({ message: 'User approved and activated successfully' });
  };
  