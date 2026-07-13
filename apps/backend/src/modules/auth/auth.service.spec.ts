import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { JwtConfigService } from '@/config/jwt-config.service';
import { UserService } from '@/modules/user/user.service';

describe('AuthService', () => {
  let service: AuthService;

  const JwtServiceMock = {
  };
  const SessionServiceMock = {
  };
  const JwtConfigServiceMock = {
  };

  const UserServiceMock = {
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: JwtServiceMock,
        },
        { provide: SessionService, useValue: SessionServiceMock },
        { provide: JwtConfigService, useValue: JwtConfigServiceMock },
        { provide: UserService, useValue: UserServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
