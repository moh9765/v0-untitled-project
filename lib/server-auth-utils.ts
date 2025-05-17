// This file contains server-side authentication utilities
// These functions should only be used in server components or API routes

import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt
 * @param password - The password to hash
 * @returns A string containing the hashed password and salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${hashBuffer.toString('hex')}.${salt}`;
}

/**
 * Verify a password against a stored hash
 * @param storedPassword - The stored password hash
 * @param suppliedPassword - The password to verify
 * @returns True if the password matches, false otherwise
 */
export async function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.');
  const hashBuffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  return hashBuffer.toString('hex') === hashedPassword;
}
