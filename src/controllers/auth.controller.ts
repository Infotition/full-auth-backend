//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import { Request, Response } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//* Function imports
import signWebToken, { IPayload } from '../utils/signWebToken';
import sendMail from '../utils/sendMail';

//* Mongo DB Models
import User, { IUser } from '../models/user.model';

//* ------------------- Controllers ------------------- *\\

/**
 * Register a new user in the system.
 *
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function registerController(req: Request, res: Response) {
  //* Validate integrity constraints
  const errors: Result<ValidationError> = validationResult(req);

  //* If errors occured, stop register route and send errors
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'request body was incomplete',
      errors: errors.array(),
    });
  }

  //* Read needed fields from body
  const { email, password, firstName, lastName } = req.body;

  //* Try to register a User
  try {
    //* Search user by email in database
    let user: IUser | null = await User.findOne({ email });

    //* If user already exists, stop register route and send errors
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'errors occured while registering',
        errors: ['user already exists'],
      });
    }

    //* Get the image url from Gravatar
    const avatar: string = gravatar.url(email, {
      s: '200',
      r: 'pq',
      d: 'mm',
    });

    //* Hash user password with salt
    const hash: string = await bcrypt.hash(password, await bcrypt.genSalt(10));

    //* Create a new User
    user = new User({
      email,
      password: hash,
      firstName,
      lastName,
      avatar,
    });

    //* Save the user in database
    await user.save();

    //* Send the json web token to the client
    const token = signWebToken({ user: { id: user.id } }, 36000);

    //* Send verification e-mail to users email
    const PROTOCOL: string = process.env.PROTOCOL || 'http';
    const HOST: string = process.env.HOST || 'localhost';
    const PORT: string = process.env.PORT || '3000';
    const CLIENT_URL = `${PROTOCOL}://${HOST}:${PORT}`;
    const emailData = `
      <h1>Please use the following link to activate your account</h1>
      <p>${CLIENT_URL}/api/auth/user/activate/${token}</p>
    `;
    sendMail(email, 'Verify your Infotition account', emailData, () => {});

    return res.status(400).json({
      success: true,
      message: 'user successfully registered, please verify your email',
      token,
    });
  } catch (error) {
    console.error('an error occured in register route: ', error);
    return res
      .status(500)
      .json({ success: false, message: 'internal server error' });
  }
}

/**
 * Verifies the email of the user.
 *
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function verifyController(req: Request, res: Response) {
  //* Get the token from request parameters
  const { token } = req.params;

  //* If no token exists, send user not authentificated
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'errors occured while activation',
      errors: ['no token', 'not authorized'],
    });
  }

  try {
    //* Verify and Decode the jwt token
    const decoded: IPayload = <IPayload>(
      jwt.verify(token, process.env.JWT_SECRET || '')
    );

    //* Find user by id and update the verified status
    await User.findOneAndUpdate({ id: decoded.user.id }, { verified: true });

    return res.status(401).json({
      success: true,
      message: 'succesfully verified email',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'errors occured while activating',
      errors: ['invalid access token'],
    });
  }
}

/**
 * Authenticate an existing user and send token.
 *
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function loginController(req: Request, res: Response) {
  //* Validate integrity constraints
  const errors: Result<ValidationError> = validationResult(req);

  //* If errors occured, stop register route and send errors
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'request body was incomplete',
      errors: errors.array(),
    });
  }

  //* Read needed fields from body
  const { email, password } = req.body;

  //* Try to authenticate the user
  try {
    //* Search user by email in database
    const user: IUser | null = await User.findOne({ email });

    //* If user does not exists, stop register route and send errors
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'errors occured while authentification',
        errors: ['invalid credentials'],
      });
    }

    //* Comare the plain passwort with the hash
    const ismatch: boolean = await bcrypt.compare(password, user.password);

    //* If password does not match, stop register route and send errors
    if (!ismatch) {
      return res.status(400).json({
        success: false,
        message: 'errors occured while authentification',
        errors: ['invalid credentials'],
      });
    }

    //* Send the json web token to the client#
    const token = signWebToken({ user: { id: user.id } }, 36000);
    return res.status(400).json({
      success: true,
      message: 'authentification was successfull',
      token,
    });
  } catch (error) {
    console.error('an error occured in login route: ', error);
    return res
      .status(500)
      .json({ success: false, message: 'internal server error' });
  }
}

/**
 * Get the information of an authenticated user.
 *
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function informationController(req: Request, res: Response) {
  try {
    //* Featch user by id in database without the selected fields
    const selection = '-password -_id -__v';
    const user: IUser | null = await User.findById((<any>req).user.id).select(
      selection
    );
    return res.status(200).json({
      success: true,
      message: 'user information succesfully fetched',
      user,
    });
  } catch (error) {
    console.error('an error occured in usser-information route: ', error);
    return res
      .status(500)
      .json({ success: false, message: 'internal server error' });
  }
}

//* --------------------- EXPORTS --------------------- *\\

export {
  registerController,
  verifyController,
  loginController,
  informationController,
};
