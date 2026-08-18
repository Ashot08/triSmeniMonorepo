import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com | mondragor',
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'test1234',
  })
  @IsString()
  password: string;
}
