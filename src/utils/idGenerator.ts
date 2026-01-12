/**
 * Utility functions for generating meaningful IDs
 */

/**
 * Generates a meaningful 10-character user ID for employees
 * Format: EMP + first 3 letters of firstName + first 3 letters of lastName + 2 digit random number
 * Example: John Doe -> EMPJOHDO12
 */
export function generateEmployeeUserId(firstName: string, lastName: string): string {
  // Clean and normalize names
  const cleanFirstName = firstName.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanLastName = lastName.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Take first 3 letters from each name (pad with X if shorter)
  const firstNamePart = (cleanFirstName + 'XXX').substring(0, 3);
  const lastNamePart = (cleanLastName + 'XXX').substring(0, 3);
  
  // Generate 2-digit random number
  const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `EMP${firstNamePart}${lastNamePart}${randomPart}`;
}

/**
 * Generates a meaningful 8-character employee code
 * Format: EMP + 5 digit sequential number
 * Example: EMP00001, EMP00002
 */
export function generateEmployeeCode(lastEmployeeCode?: string): string {
  if (!lastEmployeeCode) {
    return 'EMP00001';
  }
  
  // Extract numeric part and increment
  const numericPart = parseInt(lastEmployeeCode.replace('EMP', ''));
  const nextNumber = numericPart + 1;
  
  return `EMP${nextNumber.toString().padStart(5, '0')}`;
}

/**
 * Validates that a user ID follows the expected format
 */
export function isValidEmployeeUserId(userId: string): boolean {
  const pattern = /^EMP[A-Z]{3}[A-Z]{3}\d{2}$/;
  return pattern.test(userId);
}
