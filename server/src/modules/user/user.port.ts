import { Token, TokenPayload } from 'src/share';
import {
  RefreshTokenDTO,
  UserCondDTO,
  UserLoginDTO,
  UserRegistrationDTO,
} from './user.dto';
import { User } from './user.model';

export interface IUserService {
  register(dto: UserRegistrationDTO): Promise<string>;
  login(dto: UserLoginDTO): Promise<Token>;
  profile(userId: string): Promise<Omit<User, 'password' | 'salt'> | null>;

  rotateToken(dto: RefreshTokenDTO): Promise<Token>;

  // rpc
  introspectToken(token: string): Promise<TokenPayload>;
}

export interface IUserRepository {
  // Query
  get(id: string): Promise<User | null>;
  findByCond(cond: UserCondDTO): Promise<User | null>;
  listByIds(ids: string[]): Promise<User[]>;
  // Mutation
  insert(user: User): Promise<void>;
}
