import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';

export const requestContext = new AsyncLocalStorage<Map<string, any>>();

export function contextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const store = new Map<string, any>();
  if (req.user?.id) store.set('userId', req.user.id);

  requestContext.run(store, () => next());
}
