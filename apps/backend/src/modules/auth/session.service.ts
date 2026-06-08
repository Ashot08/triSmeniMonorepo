import { Injectable } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { Session } from '@/modules/auth/interfaces/session.interface';



@Injectable()
export class SessionService {
  constructor(private readonly redis: RedisService) {}

  async createSession(
    userId: string,
    sessionId: string,
    refreshToken: string,
    ttlSeconds: number,
  ): Promise<void> {
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.redis.createSession(sessionId, userId, refreshHash, ttlSeconds);
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return this.redis.getSession(sessionId);
  }

  async updateRefreshHash(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshHash = await bcrypt.hash(refreshToken, 10);

    await this.redis.updateSessionRefreshHash(
      sessionId,
      refreshHash,
    );
  }

  async deleteSession(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    await this.redis.deleteSession(
      userId,
      sessionId,
    );
  }

  async validateSession(
    sessionId: string,
    refreshToken: string,
  ): Promise<boolean>

  async deleteAllUserSessions(
    userId: string,
  ): Promise<void>

}
