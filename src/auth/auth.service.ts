import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthCredentialsDto,
  AuthSignInDto,
  UserKakaoDto,
} from './dto/auth-credential.dto';
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

  async signIn(authSignInDto: AuthSignInDto): Promise<any> {
    const { email, password } = authSignInDto;
    const user = await this.usersRepository.findOne(authSignInDto);

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성
      const payload = { email, nickname: user.nickname };
      const accessToken = this.jwtService.sign(payload);
      return {
        msg: '로그인 성공',
        boolean: true,
        Authorization: `Bearer ${accessToken}`,
      };
    } else {
      throw new UnauthorizedException({ msg: '로그인 실패', boolean: false });
    }
  }

  async kakaoLogin(userKakaoDto: UserKakaoDto): Promise<any> {
    const { kakaoId, name, email, provider, kakaoAccessToken } = userKakaoDto;
    const nickname = name + '&' + kakaoId;
    try {
      await this.usersRepository.createKakao(userKakaoDto);
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException(`Exisiting ${Object.keys(error.keyValue)}`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    const payload = { nickname, kakaoAccessToken };
    const accessToken = await this.jwtService.sign(payload);
    return {
      msg: '카카오 로그인 성공',
      boolean: true,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  async findAll(): Promise<any> {
    return await this.usersRepository.find();
  }
}
