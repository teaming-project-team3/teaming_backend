import { User, UserDocument } from './schemas/user.schema';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(authcredentialsDto: AuthCredentialsDto): Promise<any> {
    try {
      await this.userModel.create({
        ...authcredentialsDto,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException('Exisiting username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
