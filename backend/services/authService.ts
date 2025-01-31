import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import prisma from '../prisma';
import { addMinutes, isAfter } from 'date-fns';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;


export const generateJwt = (user: User): string => {
  return sign({ email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const createRateLimiter = (windowMs: number, maxRequests: number, message: string) => {
  return rateLimit({
    windowMs, 
    max: maxRequests, 
    message,
  });
};

// CHECKING THE USER

export async function isAccountLocked(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return false;

  if (user.lockoutUntil && isAfter(new Date(), user.lockoutUntil)) {
    
    await prisma.user.update({
      where: { email },
      data: { failedLoginAttempts: 0, lockoutUntil: null },
    });
    return false;
  }
  user.lockoutUntil && isAfter(user.lockoutUntil, new Date());
}

//  COUNT FOR FAILED LOGIN ATTEMPTS

export async function handleFailedLogin(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return;

  const failedAttempts = user.failedLoginAttempts + 1;

  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    await prisma.user.update({
      where: { email },
      data: {
        failedLoginAttempts: failedAttempts,
        lockoutUntil: addMinutes(new Date(), LOCKOUT_DURATION_MINUTES),
      },
    });
  } else {
    await prisma.user.update({
      where: { email },
      data: { failedLoginAttempts: failedAttempts },
    });
  }
}

// TO RESET THE LOGIN ATTEMPTS WHEN THE USER SIGNS IN

export async function resetFailedAttempts(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: { failedLoginAttempts: 0, lockoutUntil: null },
  });
}

