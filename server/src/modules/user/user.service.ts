import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY } from './user.di-tokens';
import {
  UserLoginDTO,
  UserRegistrationDTO,
  userRegistrationDTOSchema,
} from './user.dto';
import { ErrUsernameExisted, User, UserStatus } from './user.model';
import { IUserRepository, IUserService } from './user.port';
import { AppError, UserRole } from 'src/share';
import { v7 } from 'uuid';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async register(dto: UserRegistrationDTO): Promise<string> {
    const data = userRegistrationDTOSchema.parse(dto);

    // 1. Check username existed
    const user = await this.userRepository.findByCond({
      username: data.username,
    });

    if (user) throw AppError.from(ErrUsernameExisted, 400);

    // 2. Gen salt and hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(`${data.password}.{salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...data,
      password: hashPassword,
      salt,
      id: newId,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Insert new uer to database
    await this.userRepository.insert(newUser);
    return newId;
  }

  async login(dto: UserLoginDTO): Promise<string> {
    return 'This action logs in a user';
  }

  // async profile(
  //   userId: string,
  // ): Promise<Omit<User, 'password' | 'salt'> | null> {
  //   return 'This action returns a user profile';
  // }
}
