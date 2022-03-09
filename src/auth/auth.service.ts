import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto, AuthSignUpDto } from './dto/auth-credential.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return await this.usersRepository.create(authCredentialsDto);
  }

  async signIn(authSignUpDto: AuthSignUpDto): Promise<object> {
    const { email, password } = authSignUpDto;
    const user = await this.usersRepository.findOne(authSignUpDto);

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      return {
        msg: '로그인 성공',
        boolean: true,
        Authorization: `Bearea ${accessToken}`,
      };
    } else {
      throw new UnauthorizedException({ msg: '로그인 실패', boolean: false });
    }
  }
}
