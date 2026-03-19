import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('health')
  async health() {
    const ping = await this.redisService.ping();
    return { status: ping };
  }

  @Get('test')
  async test() {
    await this.redisService.set('test-key', 'Hello from Redis!');
    const value = await this.redisService.get('test-key');
    return { key: 'test-key', value };
  }
}
