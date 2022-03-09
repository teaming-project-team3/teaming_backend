import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UsersRepository } from './users.repository';
@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<any> {
    return await this.usersRepository.create(authcredentialsDto);
  }
}
