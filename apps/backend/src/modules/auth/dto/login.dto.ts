import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com | my-username',
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  password: string;
}
