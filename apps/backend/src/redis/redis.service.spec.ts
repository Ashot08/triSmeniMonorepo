import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from '@/common/constants/injection-tokens';

describe('RedisService', () => {
  let service: RedisService;
  let redisMock: Record<string, jest.Mock>;

  beforeEach(async () => {
    redisMock = {
      ping: jest.fn().mockResolvedValue('PONG'),
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT,
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  describe('ping', () => {
    it('should return PONG', async () => {
      const result = await service.ping();
      expect(result).toBe('PONG');
      expect(redisMock.ping).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should set a value', async () => {
      await service.set('key', 'value');
      expect(redisMock.set).toHaveBeenCalledWith('key', 'value');
    });
  });

  describe('get', () => {
    it('should return value when key exists', async () => {
      redisMock.get.mockResolvedValue('value');
      const result = await service.get('key');
      expect(result).toBe('value');
      expect(redisMock.get).toHaveBeenCalledWith('key');
    });

    it('should return null when key does not exist', async () => {
      const result = await service.get('nonexistent');
      expect(result).toBeNull();
    });
  });
});
