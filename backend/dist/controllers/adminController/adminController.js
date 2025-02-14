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
exports.deactivateUser = exports.approveUser = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma"));
// export const approveUser = async (req: ExpressRequest, res: Response): Promise<void> => {
//     const { userId } = req.body;
//     if (req.user?.role !== UserRole.ADMIN) {
//       res.status(403).json({ message: 'You are not authorized to approve users' });
//       return;
//     }
//     const userToApprove = await prisma.user.findUnique({ where: { id: userId } });
//     if (!userToApprove) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     if (userToApprove.companyId !== req.user.companyId) {
//       res.status(403).json({ message: 'You can only approve users from your company' });
//       return;
//     }
//     // Update the user status to active
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { status: 'active' },
//     });
//     // Create an audit log for user approval
//     await prisma.auditLog.create({
//       data: {
//         action: 'approve_user',
//         resourceType: 'User',
//         resourceId: updatedUser.id,
//         details: 'User approved and set to active',
//         createdByUserId: req.user.id,
//       },
//     });
//     res.status(200).json({ message: `User approved and activated successfully` });
//   };
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.body;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.UserRole.ADMIN) {
        res.status(403).json({ message: 'You are not authorized to approve users' });
        return;
    }
    const userToApprove = yield prisma_1.default.user.findUnique({ where: { id: userId } });
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
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { status: 'active' },
    });
    // Create an audit log for user approval
    yield prisma_1.default.auditLog.create({
        data: {
            action: 'approve_user',
            resourceType: 'User',
            resourceId: updatedUser.id,
            details: `User ${updatedUser.username} approved and set to active`,
            createdByUserId: req.user.id,
        },
    });
    res.status(200).json({ message: `User ${updatedUser.username} activated successfully` });
});
exports.approveUser = approveUser;
// Deactivate User Route
const deactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.body;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.UserRole.ADMIN) {
        res.status(403).json({ message: 'You are not authorized to deactivate users' });
        return;
    }
    const userToDeactivate = yield prisma_1.default.user.findUnique({ where: { id: userId } });
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
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { status: 'inactive' },
    });
    // Create an audit log for user deactivation
    yield prisma_1.default.auditLog.create({
        data: {
            action: 'deactivate_user',
            resourceType: 'User',
            resourceId: updatedUser.id,
            details: `User ${updatedUser.username} deactivated`,
            createdByUserId: req.user.id,
        },
    });
    res.status(200).json({ message: `User ${updatedUser.username} deactivated successfully` });
});
exports.deactivateUser = deactivateUser;
