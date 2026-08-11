import {
  IsUUID,
} from 'class-validator';


export class AddUserToGameDto {
  @IsUUID()
  userId: string;
}
