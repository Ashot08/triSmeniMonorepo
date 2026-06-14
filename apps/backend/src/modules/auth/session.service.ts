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
    const session =
      await this.getSession(sessionId);

    if (!session) {
      return;
    }

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
    const session = await this.getSession(sessionId);

    if (!session) {
      return;
    }

    if (session.userId !== userId) {
      return;
    }

    await this.redis.deleteSession(
      userId,
      sessionId,
    );
  }

  async getUserSessions(
    userId: string,
  ): Promise<string[]> {
    return this.redis.getUserSessions(
      userId,
    );
  }

  async deleteAllUserSessions(
    userId: string,
  ): Promise<void> {

    const sessions = await this.redis.getUserSessions(userId);

    if (!sessions.length) {
      return;
    }

    await this.redis.deleteSessions(
      userId,
      sessions,
    );
  }

  async validateRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
  ): Promise<boolean> {

    const session =
      await this.getSession(sessionId);

    if (!session) {
      return false;
    }

    if (session.userId !== userId) {
      return false;
    }

    return bcrypt.compare(
      refreshToken,
      session.refreshHash,
    );
  }
}
