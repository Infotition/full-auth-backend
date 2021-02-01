//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

//* Function imports
import { IPayload } from '../utils/signWebToken';

//* ------------------ AuthMiddleware ----------------- *\\

/**
 * Middleware to check if a user is authentificated correctly.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @return {*}
 */
function auth(req: Request, res: Response, next: Function) {
  //* Get the token from header
  const token = req.header('x-auth-token');

  //* If no token exists, send user not authentificated
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'errors occured while authentification',
      errors: ['no token', 'not authorized'],
    });
  }

  try {
    //* Verify and Decode the jwt token
    const decoded: IPayload = <IPayload>(
      jwt.verify(token, process.env.JWT_SECRET || '')
    );
    //* Save the payload in the request
    (<any>req).user = decoded.user;
    return next();
  } catch (error) {
    console.error('an error occured in auth middleware: ', error);
    return res
      .status(500)
      .json({ success: false, message: 'internal server error' });
  }
}

export default auth;
