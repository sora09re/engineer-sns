import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { SignupInput } from 'src/auth/dto/signup.input';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
