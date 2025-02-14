import prisma from '../../prisma';
import { Customer } from '@prisma/client';

// Create a new Customer
export const createCustomerService = async (data: Partial<Customer>): Promise<Customer> => {
  if (!data.name || !data.email) {
    throw new Error('Missing required fields: name or email');
  }
  return await prisma.customer.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address || undefined,
    },
  });
};

// Get all Customers
export const getCustomersService = async (): Promise<Customer[]> => {
  return await prisma.customer.findMany();
};

// Get a single Customer by ID
export const getCustomerByIdService = async (id: string): Promise<Customer | null> => {
  return await prisma.customer.findUnique({
    where: { id },
  });
};

// Update a Customer
export const updateCustomerService = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer | null> => {
  return await prisma.customer.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address || undefined,
    },
  });
};

// Delete a Customer
export const deleteCustomerService = async (id: string): Promise<Customer | null> => {
  return await prisma.customer.delete({
    where: { id },
  });
};