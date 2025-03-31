import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TOKEN_PROVIDER, USER_REPOSITORY } from './user.di-tokens';
import {
  GoogleLoginDTO,
  googleLoginSchema,
  RefreshTokenDTO,
  refreshTokenDTOSchema,
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
import {
  AppError,
  ErrNotFound,
  ErrTokenInvalid,
  ITokenProvider,
  IWorkspaceRPC,
  Token,
  TokenPayload,
  UserRole,
} from 'src/share';
import { v7 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/share/config/config.interface';
import { WORKSPACE_RPC } from 'src/share/share.di-tokens';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: ITokenProvider,
    @Inject(WORKSPACE_RPC) private readonly workspaceRpc: IWorkspaceRPC,
    private readonly configService: ConfigService,
  ) {}
  async register(dto: UserRegistrationDTO): Promise<string> {
    const data = userRegistrationDTOSchema.parse(dto);

    // 1. Check username existed
    const user = await this.userRepository.findByCond({
      email: data.email,
    });

    if (user) throw AppError.from(ErrUsernameExisted, 400);

    // 2. Gen salt and hash password
    const saltOrRounds =
      this.configService?.get<SecurityConfig>('security')?.bcryptSaltOrRound ||
      10;
    const bcryptSaltRounds = Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : +saltOrRounds;

    const salt = bcrypt.genSaltSync(bcryptSaltRounds);
    const hashPassword = await bcrypt.hash(`${data.password}.${salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...data,
      email: data.email,
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

    const workSpaceName = [data.firstName, data.lastName].join(' ');
    const workspace = await this.workspaceRpc.create(workSpaceName, newUser.id);

    if (!workspace) {
      throw ErrNotFound;
    }

    await this.userRepository.update(newUser.id, {
      defaultWorkspace: workspace.slug,
    });

    return newId;
  }

  async login(dto: UserLoginDTO): Promise<Token> {
    const data = userLoginDTOSchema.parse(dto);

    // 1. find user with username from DTO
    const user = await this.userRepository.findByCond({
      email: data.email,
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

    if (
      [UserStatus.DELETED, UserStatus.INACTIVE, UserStatus.BANNED].includes(
        user.status as UserStatus,
      )
    ) {
      throw AppError.from(ErrUserInactivated, 400);
    }

    // 3. Return tokens
    const role = user.role;
    const token = await this.tokenProvider.generateTokens({
      sub: user.id,
      role,
    });
    return token;
  }

  async profile(
    userId: string,
  ): Promise<Omit<User, 'password' | 'salt'> | null> {
    const user = await this.userRepository.get(userId);

    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    const { password, salt, ...rest } = user;

    return rest;
  }

  async introspectToken(token: string): Promise<TokenPayload> {
    const payload = await this.tokenProvider.verifyToken(token);

    if (!payload) {
      throw AppError.from(ErrTokenInvalid, 400);
    }

    // sub is user's ID
    const user = await this.userRepository.get(payload.sub);

    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    if (
      [UserStatus.DELETED, UserStatus.INACTIVE, UserStatus.BANNED].includes(
        user.status as UserStatus,
      )
    ) {
      throw AppError.from(ErrUserInactivated, 400);
    }

    return {
      sub: user.id,
      role: user.role,
    };
  }

  async rotateToken(dto: RefreshTokenDTO): Promise<Token> {
    const data = refreshTokenDTOSchema.parse(dto);

    // 1. verify token
    const payload = await this.tokenProvider.verifyRefreshToken(data.token);
    if (!payload) {
      throw AppError.from(ErrTokenInvalid, 400);
    }

    // 2. generate new tokens
    const token = this.tokenProvider.generateTokens({
      role: payload.role,
      sub: payload.sub,
    });

    return token;
  }

  async validateGoogleUser(dto: GoogleLoginDTO): Promise<User> {
    const data = googleLoginSchema.parse(dto);
    const user = await this.userRepository.findByCond({
      email: data.email,
    });

    if (user) return user;

    const newId = v7();

    const saltOrRounds =
      this.configService?.get<SecurityConfig>('security')?.bcryptSaltOrRound ||
      10;
    const bcryptSaltRounds = Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : +saltOrRounds;
    const randomPassword = 'SOME_RANDOM_PASSWORD'; // TODO: more secure password, using nanoid generator
    const salt = bcrypt.genSaltSync(bcryptSaltRounds);
    const hashPassword = await bcrypt.hash(`${randomPassword}.${salt}`, 10);

    const newUser = await this.userRepository.insert({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      password: hashPassword,
      salt: salt,
      id: newId,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const workSpaceName = [data.firstName, data.lastName].join(' ');
    const workspace = await this.workspaceRpc.create(workSpaceName, newUser.id);

    if (!workspace) {
      throw ErrNotFound;
    }

    await this.userRepository.update(newUser.id, {
      defaultWorkspace: workspace.slug,
    });

    return newUser;
  }

  async generateGGTokens(email: string): Promise<Token> {
    const user = await this.userRepository.findByCond({
      email: email,
    });

    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    const role = user.role;
    const token = await this.tokenProvider.generateTokens({
      sub: user.id,
      role,
    });
    return token;
  }
}
