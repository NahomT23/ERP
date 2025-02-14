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
exports.deleteSalesLead = exports.updateSalesLead = exports.getSalesLeadById = exports.getSalesLeads = exports.createSalesLead = void 0;
const salesLeadService_1 = require("../../services/salesService/salesLeadService");
// Create a new Sales Lead
const createSalesLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leadData = req.body;
        const createdLead = yield (0, salesLeadService_1.createSalesLeadService)(leadData);
        res.status(201).json({ message: 'Sales Lead created successfully', data: createdLead });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating Sales Lead', error: error });
    }
});
exports.createSalesLead = createSalesLead;
// Get all Sales Leads
const getSalesLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leads = yield (0, salesLeadService_1.getSalesLeadsService)();
        res.status(200).json({ message: 'Sales Leads retrieved successfully', data: leads });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving Sales Leads', error: error });
    }
});
exports.getSalesLeads = getSalesLeads;
// Get a single Sales Lead by ID
const getSalesLeadById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const lead = yield (0, salesLeadService_1.getSalesLeadByIdService)(Number(id));
        if (!lead) {
            res.status(404).json({ message: 'Sales Lead not found' });
        }
        res.status(200).json({ message: 'Sales Lead retrieved successfully', data: lead });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving Sales Lead', error: error });
    }
});
exports.getSalesLeadById = getSalesLeadById;
// Update a Sales Lead
const updateSalesLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedLead = yield (0, salesLeadService_1.updateSalesLeadService)(Number(id), updatedData);
        if (!updatedLead) {
            res.status(404).json({ message: 'Sales Lead not found' });
        }
        res.status(200).json({ message: 'Sales Lead updated successfully', data: updatedLead });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating Sales Lead', error: error });
    }
});
exports.updateSalesLead = updateSalesLead;
// Delete a Sales Lead
const deleteSalesLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedLead = yield (0, salesLeadService_1.deleteSalesLeadService)(Number(id));
        if (!deletedLead) {
            res.status(404).json({ message: 'Sales Lead not found' });
        }
        res.status(200).json({ message: 'Sales Lead deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting Sales Lead', error: error });
    }
});
exports.deleteSalesLead = deleteSalesLead;
