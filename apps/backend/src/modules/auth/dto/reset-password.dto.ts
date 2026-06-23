import {
  IsNotEmpty,
  IsString, MaxLength,
  MinLength,
} from 'class-validator';


export class ResetPasswordDto {

  @IsString()
  token: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(200)
  password: string;

}
