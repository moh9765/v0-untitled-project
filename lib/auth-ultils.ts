import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${hashBuffer.toString('hex')}.${salt}`;
}

export async function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.');
  const hashBuffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  return hashBuffer.toString('hex') === hashedPassword;
}