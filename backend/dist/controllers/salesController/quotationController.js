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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuotation = exports.updateQuotation = exports.getQuotationById = exports.getQuotations = exports.createQuotation = void 0;
const client_1 = require("@prisma/client");
const quotationService_1 = require("../../services/salesService/quotationService");
// Create a new Quotation
const createQuotation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { customerId, totalAmount, status } = req.body;
        // Extract the authenticated user's ID
        const createdByUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdByUserId) {
            res.status(401).json({ error: 'Unauthorized: User ID is missing' });
            return;
        }
        // Validate required fields
        if (!totalAmount || !status) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Validate status against the QuotationStatus enum
        let parsedStatus;
        if (status === 'DRAFT') {
            parsedStatus = client_1.QuotationStatus.DRAFT;
        }
        else if (status === 'SENT') {
            parsedStatus = client_1.QuotationStatus.SENT;
        }
        else if (status === 'ACCEPTED') {
            parsedStatus = client_1.QuotationStatus.ACCEPTED;
        }
        else if (status === 'REJECTED') {
            parsedStatus = client_1.QuotationStatus.REJECTED;
        }
        else {
            res.status(400).json({ error: 'Invalid status value' });
            return;
        }
        // Call the service
        const quotation = yield (0, quotationService_1.createQuotationService)({
            customerId,
            totalAmount,
            status: parsedStatus,
            createdByUserId,
        });
        res.status(201).json(quotation);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createQuotation = createQuotation;
// Get all Quotations
const getQuotations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotations = yield (0, quotationService_1.getQuotationsService)();
        res.status(200).json(quotations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getQuotations = getQuotations;
// Get a single Quotation by ID
const getQuotationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const quotation = yield (0, quotationService_1.getQuotationByIdService)(parseInt(id, 10));
        if (!quotation) {
            res.status(404).json({ error: 'Quotation not found' });
            return;
        }
        res.status(200).json(quotation);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getQuotationById = getQuotationById;
// Update a Quotation
// export const updateQuotation = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { totalAmount, status, customerId } = req.body;
//     let parsedStatus: QuotationStatus | undefined;
//     if (status) {
//       if (status === 'DRAFT') {
//         parsedStatus = QuotationStatus.DRAFT;
//       } else if (status === 'SENT') {
//         parsedStatus = QuotationStatus.SENT;
//       } else if (status === 'ACCEPTED') {
//         parsedStatus = QuotationStatus.ACCEPTED;
//       } else if (status === 'REJECTED') {
//         parsedStatus = QuotationStatus.REJECTED;
//       } else {
//         res.status(400).json({ error: 'Invalid status value' });
//         return;
//       }
//     }
//     const updatedQuotation = await updateQuotationService(parseInt(id, 10), {
//       totalAmount,
//       status: parsedStatus,
//       customerId,
//     });
//     if (!updatedQuotation) {
//       res.status(404).json({ error: 'Quotation not found' });
//       return;
//     }
//     res.status(200).json(updatedQuotation);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const updateQuotation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        let parsedStatus;
        if (status) {
            if (['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'].includes(status)) {
                parsedStatus = status;
            }
            else {
                res.status(400).json({ error: 'Invalid status value' });
                return;
            }
        }
        const updatedQuotation = yield (0, quotationService_1.updateQuotationService)(parseInt(id, 10), {
            status: parsedStatus,
        });
        if (!updatedQuotation) {
            res.status(404).json({ error: 'Quotation not found' });
            return;
        }
        res.status(200).json(updatedQuotation);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateQuotation = updateQuotation;
// Delete a Quotation
const deleteQuotation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const success = yield (0, quotationService_1.deleteQuotationService)(parseInt(id, 10));
        if (!success) {
            res.status(404).json({ error: 'Quotation not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteQuotation = deleteQuotation;
