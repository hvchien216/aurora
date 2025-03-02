import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TOKEN_PROVIDER, USER_REPOSITORY } from './user.di-tokens';
import {
  UserLoginDTO,
  userLoginDTOSchema,
  UserRegistrationDTO,
  userRegistrationDTOSchema,
} from './user.dto';
import {
  ErrInvalidUsernameAndPassword,
  ErrUserInactivated,
  ErrUsernameExisted,
  User,
  UserStatus,
} from './user.model';
import { IUserRepository, IUserService } from './user.port';
import { AppError, ITokenProvider, UserRole } from 'src/share';
import { v7 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/share/config/config.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: ITokenProvider,
    private readonly configService: ConfigService,
  ) {}
  async register(dto: UserRegistrationDTO): Promise<string> {
    const data = userRegistrationDTOSchema.parse(dto);

    // 1. Check username existed
    const user = await this.userRepository.findByCond({
      username: data.username,
    });

    if (user) throw AppError.from(ErrUsernameExisted, 400);

    // 2. Gen salt and hash password
    const saltOrRounds =
      this.configService.get<SecurityConfig>('security').bcryptSaltOrRound;
    const bcryptSaltRounds = Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : +saltOrRounds;

    const salt = bcrypt.genSaltSync(bcryptSaltRounds);
    const hashPassword = await bcrypt.hash(`${data.password}.${salt}`, 10);

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
    const data = userLoginDTOSchema.parse(dto);

    // 1. find user with username from DTO
    const user = await this.userRepository.findByCond({
      username: data.username,
    });

    if (!user)
      throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog(
        'User not found',
      );

    // 2. Compare password
    const isMatch = await bcrypt.compare(
      `${data.password}.${user.salt}`,
      user.password,
    );

    if (!isMatch) {
      throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog(
        'Password is incorrect',
      );
    }

    if ([UserStatus.DELETED, UserStatus.INACTIVE].includes(user.status)) {
      throw AppError.from(ErrUserInactivated, 400);
    }

    // 3. Return token
    const role = user.role;
    const token = await this.tokenProvider.generateToken({
      sub: user.id,
      role,
    });
    return token;
  }

  // async profile(
  //   userId: string,
  // ): Promise<Omit<User, 'password' | 'salt'> | null> {
  //   return 'This action returns a user profile';
  // }
}
