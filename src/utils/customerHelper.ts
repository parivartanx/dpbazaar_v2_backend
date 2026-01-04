import { CustomerRepository } from '../repositories/prisma/CustomerRepository';

const customerRepo = new CustomerRepository();

/**
 * Converts a User ID (from JWT token) to a Customer ID (from database)
 * @param userId - The User ID from the JWT token
 * @returns The Customer ID from the database
 * @throws Error if customer profile is not found
 */
export async function getCustomerIdFromUserId(userId: string): Promise<string> {
  const customer = await customerRepo.findByUserId(userId);
  if (!customer) {
    throw new Error('Customer profile not found');
  }
  return customer.id;
}

