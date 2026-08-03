import {
  IsOptional,
  IsString,
  Length,
} from 'class-validator';


export class JoinGameDto {
  @IsOptional()
  @IsString()
  @Length(4, 50)
  inviteCode?: string;
}
