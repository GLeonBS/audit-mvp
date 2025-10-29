import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { requestContext } from './request-context';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request & { user: any }, res: Response, next: NextFunction) {
    const store = new Map<string, any>();

    if (req.user?.id) {
      store.set('userId', req.user.id);
    }

    requestContext.run(store, () => next());
  }
}
