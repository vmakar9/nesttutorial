import { IsString, MinLength } from 'class-validator';

export class ChangePasswordReguestDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
