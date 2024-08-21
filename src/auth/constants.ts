import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const ALLOW_UNAUTH = 'allowUnauth';
export const NO_ADMIN = 'noAdmin';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const AllowUnauth = () => SetMetadata(ALLOW_UNAUTH, true);
export const NoAdmin = () => SetMetadata(NO_ADMIN, true);

