import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from '../../../libs/utils/bcrypt';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class GetUserServiceImpl implements GetUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  getById(_id: string) {
    return this.userModel.findById(_id).select(['-password']).lean();
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    if (!user || !user.currentHashedRefreshToken) return false;

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
    return false;
  }
}
