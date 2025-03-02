import { UserCondDTO, UserLoginDTO, UserRegistrationDTO } from './user.dto';
import { User } from './user.model';

export interface IUserService {
  register(dto: UserRegistrationDTO): Promise<string>;
  login(dto: UserLoginDTO): Promise<string>;
  // profile(userId: string): Promise<Omit<User, 'password' | 'salt'> | null>;
}

export interface IUserRepository {
  // Query
  get(id: string): Promise<User | null>;
  findByCond(cond: UserCondDTO): Promise<User | null>;
  listByIds(ids: string[]): Promise<User[]>;
  // Mutation
  insert(user: User): Promise<void>;
}
