import { UserRole } from "@prisma/client";
import { Response } from 'express';
import prisma from '../../prisma';
import { ExpressRequest } from "../../middlewares/authMiddleware/authMiddleware";


export const approveUser = async (req: ExpressRequest, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ message: 'You are not authorized to approve users' });
        return;
    }

    const userToApprove = await prisma.user.findUnique({ where: { id: userId } });

    if (!userToApprove) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    if (userToApprove.companyId !== req.user.companyId) {
        res.status(403).json({ message: 'You can only approve users from your company' });
        return;
    }

    if (userToApprove.status === 'active') {
        res.status(400).json({ message: `User ${userToApprove.username} is already activated` });
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
            details: `User ${updatedUser.username} approved and set to active`,
            createdByUserId: req.user.id,
        },
    });

    res.status(200).json({ message: `User ${updatedUser.username} activated successfully` });
};

// Deactivate User Route
export const deactivateUser = async (req: ExpressRequest, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ message: 'You are not authorized to deactivate users' });
        return;
    }

    const userToDeactivate = await prisma.user.findUnique({ where: { id: userId } });

    if (!userToDeactivate) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    if (userToDeactivate.companyId !== req.user.companyId) {
        res.status(403).json({ message: 'You can only deactivate users from your company' });
        return;
    }

    if (userToDeactivate.status === 'inactive') {
        res.status(400).json({ message: `User ${userToDeactivate.username} is already deactivated` });
        return;
    }

    // Update the user status to inactive
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 'inactive' },
    });

    // Create an audit log for user deactivation
    await prisma.auditLog.create({
        data: {
            action: 'deactivate_user',
            resourceType: 'User',
            resourceId: updatedUser.id,
            details: `User ${updatedUser.username} deactivated`,
            createdByUserId: req.user.id,
        },
    });

    res.status(200).json({ message: `User ${updatedUser.username} deactivated successfully` });
};
