import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Redis connection tests')
@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check redis health' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  async health() {
    const ping = await this.redisService.ping();
    return { status: ping };
  }

  @Get('test')
  @ApiOperation({ summary: 'Get redis test-key' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  async test() {
    await this.redisService.set('test-key', 'Hello from Redis!');
    const value = await this.redisService.get('test-key');
    return { key: 'test-key', value };
  }
}
