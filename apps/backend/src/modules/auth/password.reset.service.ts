import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { randomBytes } from 'node:crypto';
import { UserService } from '@/modules/user/user.service';
import { SessionService } from '@/modules/auth/session.service';

@Injectable()
export class PasswordResetService {

  constructor(
    private redis: RedisService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}


  private getKey(token:string){
    return `password-reset:${token}`;
  }


  async create(
    token:string,
    userId:string,
  ){

    await this.redis.set(
      this.getKey(token),
      userId,
      900,
    );

  }


  async getUserId(
    token:string,
  ){

    return this.redis.get(
      this.getKey(token),
    );

  }


  async remove(
    token:string,
  ){

    await this.redis.delete(
      this.getKey(token),
    );

  }

  async requestPasswordReset(
    email: string,
  ) {

    const user =
      await this.userService.findByEmail(email);


    if (!user) {
      return;
    }


    const token = randomBytes(32)
        .toString('hex');


    await this.create(
      token,
      user.id,
    );


    // todo: подключить email service
    console.log(
      `Reset link:
    /reset-password?token=${token}`
    );

  }

  async resetPassword(
    token: string,
    newPassword: string,
  ) {

    const userId =
      await this.getUserId(
        token,
      );


    if (!userId) {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }


    await this.userService.updatePassword(
      userId,
      newPassword,
    );


    await this.remove(
      token,
    );


    await this.sessionService.deleteAllUserSessions(
      userId,
    );

  }

}
