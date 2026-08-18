import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserToGameDto {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'UUID of user, who should be added to the game',
  })
  @IsUUID()
  userId: string;
}
