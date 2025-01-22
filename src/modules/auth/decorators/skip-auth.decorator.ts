import { SKIP_AUTH } from '../constants/constants';
import { SetMetadata } from '@nestjs/common';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
