//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import jwt from 'jsonwebtoken';

//* ------------------ SignWebToken ------------------- *\\

/**
 * Defines the payload for json web tokens.
 *
 * @export
 * @interface IPayload
 * @extends {Document}
 */
export interface IPayload {
  user: {
    id: any;
  };
}

/**
 * Returns the payload signed json web token.
 *
 * @param {IPayload} payload
 * @param {number} expiresIn
 * @return {*}  {string}
 */
function signWebToken(payload: IPayload, expiresIn: number): string {
  //* Sign the payload into JSON web token
  return jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn });
}
//* --------------------- EXPORTS --------------------- *\\

export default signWebToken;
