import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordResetService } from '@/modules/auth/password.reset.service';

describe('AuthController', () => {
  let controller: AuthController;

  const passwordResetServiceMock = {
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  const authServiceMock = {
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: PasswordResetService,
          useValue: passwordResetServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
