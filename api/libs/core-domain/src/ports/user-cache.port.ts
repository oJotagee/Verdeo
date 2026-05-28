import { User } from '../entities/user.entity';

export const USER_CACHE = Symbol('USER_CACHE');

export interface UserCache {
  get(userId: string): Promise<User | null>;
  set(userId: string, user: User, ttlSeconds?: number): Promise<void>;
  invalidate(userId: string): Promise<void>;
}
