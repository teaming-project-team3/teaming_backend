import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Model } from 'mongoose';
import { User } from './auth.interface';
import { UsersRepository } from './users.repository';
@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<any> {
    const { password, passwordCheck } = authcredentialsDto;
    if (password !== passwordCheck) {
      return { msg: 'IsNotEqual', boolean: false };
    }

    await this.usersRepository.create(authcredentialsDto);
    return { msg: '회원가입 성공', boolean: true };
  }
}
