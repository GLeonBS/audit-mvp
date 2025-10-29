import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: LoginDto) {
    const user = await this.userService.findOne(login.email);

    if (!user || bcrypt.compareSync(login.password, user.password) === false) {
      throw new Error('Invalid credentials');
    }

    const { password, ...userData } = user;

    return {
      access_token: this.jwtService.sign(userData),
    };
  }
}
