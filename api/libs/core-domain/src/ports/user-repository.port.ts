import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(params: {
    page: number;
    size: number;
    search?: string;
  }): Promise<{ users: User[]; total: number }>;
  save(user: User): Promise<User>;
  saveInTransaction(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
