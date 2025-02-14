import { Request, Response } from 'express';
import {
  createCustomerService,
  getCustomersService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
} from '../../services/salesService/customerService';

// Create a new Customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerData = req.body;
    const customer = await createCustomerService(customerData);
    res.status(201).json({ message: 'Customer created successfully', data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Customer', error: error});
  }
};

// Get all Customers
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await getCustomersService();
    res.status(200).json({ message: 'Customers retrieved successfully', data: customers });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Customers', error: error });
  }
};

// Get a single Customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    res.status(200).json({ message: 'Customer retrieved successfully', data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Customer', error: error });
  }
};

// Update a Customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const customer = await updateCustomerService(id, updatedData);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    res.status(200).json({ message: 'Customer updated successfully', data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Customer', error: error });
  }
};

// Delete a Customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await deleteCustomerService(id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Customer', error: error });
  }
};