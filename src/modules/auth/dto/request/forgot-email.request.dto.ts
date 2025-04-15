import { IsString } from 'class-validator';

export class ForgotEmailRequestDto {
  @IsString()
  email: string;
}
