import { IsString, MinLength } from 'class-validator';

export class ChangePasswordRegusetDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
