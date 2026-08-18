import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGameDto {
  @ApiProperty({
    example: '3104',
  })
  @IsOptional()
  @IsString()
  @Length(4, 50)
  inviteCode?: string;
}
