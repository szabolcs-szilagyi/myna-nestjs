import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash/fp';

/**
 * NextJS' catch all api declaration will add a `catchAll` parameter with
 * details about the path that was handled, this middle ware will remove that
 * field.
 *
 * @param {} Request
 * @param {} Response
 * @param {} NextFunction
 */
export function catchAllOmiter(req: Request, res: Response, next: NextFunction) {
  req.query = omit('catchAll', req.query);

  next();
}
