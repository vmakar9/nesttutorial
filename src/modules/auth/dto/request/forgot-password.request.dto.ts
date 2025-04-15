import { IsString, MinLength } from 'class-validator';

export class ForgotPasswordRequestDto {
  @IsString()
  @MinLength(6)
  newPassword: string;
}
