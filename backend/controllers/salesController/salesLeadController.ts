import { Request, Response } from 'express';
import { createSalesLeadService, getSalesLeadsService, getSalesLeadByIdService, updateSalesLeadService, deleteSalesLeadService } from '../../services/salesService/salesLeadService';

// Create a new Sales Lead
export const createSalesLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const leadData = req.body;
    const createdLead = await createSalesLeadService(leadData);
    res.status(201).json({ message: 'Sales Lead created successfully', data: createdLead });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Sales Lead', error: error });
  }
};

// Get all Sales Leads
export const getSalesLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const leads = await getSalesLeadsService();
    res.status(200).json({ message: 'Sales Leads retrieved successfully', data: leads });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Sales Leads', error: error });
  }
};

// Get a single Sales Lead by ID
export const getSalesLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await getSalesLeadByIdService(Number(id));
    if (!lead) {
      res.status(404).json({ message: 'Sales Lead not found' });
    }
    res.status(200).json({ message: 'Sales Lead retrieved successfully', data: lead });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Sales Lead', error: error });
  }
};

// Update a Sales Lead
export const updateSalesLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedLead = await updateSalesLeadService(Number(id), updatedData);
    if (!updatedLead) {
       res.status(404).json({ message: 'Sales Lead not found' });
    }
    res.status(200).json({ message: 'Sales Lead updated successfully', data: updatedLead });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Sales Lead', error: error });
  }
};

// Delete a Sales Lead
export const deleteSalesLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedLead = await deleteSalesLeadService(Number(id));
    if (!deletedLead) {
       res.status(404).json({ message: 'Sales Lead not found' });
    }
    res.status(200).json({ message: 'Sales Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Sales Lead', error: error });
  }
};