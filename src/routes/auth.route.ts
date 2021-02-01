//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import express, { Request, Response, Router } from 'express';
import {
  check,
  validationResult,
  Result,
  ValidationError,
} from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcrypt';

//* Function imports
import signWebToken from '../utils/signWebToken';

//* Mongo DB Models
import User, { IUser } from '../models/user.model';

//* Middlewares
import auth from '../middlewares/auth.middleware';

//* ------------------ CONFIGURATION ------------------ *\\

const authRouter: Router = express.Router();

//* --------------------- ROUTES ---------------------- *\\

/**
 * Route registering a new user in the system.
 * @name post/api/auth/user/register
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.post(
  '/register',
  [
    //* Check integrity constraints
    check('email', 'email field is required').notEmpty(),
    check('password', 'password field is required').notEmpty(),
    check('firstName', 'first name field is required').notEmpty(),
    check('lastName', 'last name field is required').notEmpty(),

    check('email', 'please include a valid email').isEmail().not(),
    check(
      'password',
      'please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
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
      const hash: string = await bcrypt.hash(
        password,
        await bcrypt.genSalt(10)
      );

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
      return res.status(400).json({
        success: true,
        message: 'user successfully registered',
        token,
      });
    } catch (error) {
      console.error('an error occured in register route: ', error);
      return res
        .status(500)
        .json({ success: false, message: 'internal server error' });
    }
  }
);

/**
 * Route to authenticate an existing user.
 * @name post/api/auth/user/login
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.post(
  '/login',
  [
    //* Check integrity constraints
    check('email', 'email field is required').notEmpty(),
    check('password', 'password field is required').notEmpty(),

    check('email', 'please include a valid email').isEmail().not(),
    check(
      'password',
      'please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
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
);

/**
 * Route to get the user information of the authenticated user.
 * @name post/api/auth/user/information
 * @access private
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.get('/information', auth, async (req: Request, res: Response) => {
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
});

export default authRouter;
