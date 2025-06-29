/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request } from 'express';

export const Authorizated = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request.user;

    return data ? user![data] : user;
  },
);
