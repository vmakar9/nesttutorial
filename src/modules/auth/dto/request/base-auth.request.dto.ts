import { IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { BaseUserRequestDto } from '../../../../user/models/dto/request/base=user.request.dto';

export class BaseAuthRequestDto extends PickType(BaseUserRequestDto, [
  'name',
  'email',
  'password',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
