import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({message:'Access Denied'});

  try {
    const verified = jwt.verify(token, config.secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({message:'Invalid Token'});
  }
};
