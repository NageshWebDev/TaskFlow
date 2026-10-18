import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

export async function register(email: string, password: string) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    tokenVersion: 0,
  });

  const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion });
  return {
    token,
    user: { id: user.id, email: user.email },
  };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion });
  return {
    token,
    user: { id: user.id, email: user.email },
  };
}

/** Invalidate all existing JWTs by bumping tokenVersion */
export async function logout(userId: string) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { tokenVersion: 1 } },
    { new: true }
  );
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return { message: 'Logged out successfully' };
}
