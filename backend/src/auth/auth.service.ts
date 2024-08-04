import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { SignupInput } from 'src/auth/dto/signup.input';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<Users> {
    const { email, password } = signupInput;

    // 既にメールアドレスが使用されていないかチェック
    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersService.createUser({
      ...signupInput,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
