//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import express, { Router } from 'express';

//* Middlewares
import auth from '../middlewares/auth.middleware';

//* Controllers
import {
  registerController,
  verifyController,
  loginController,
  informationController,
} from '../controllers/auth.controller';

//* Utils import
import { validRegister, validLogin } from '../utils/valid';

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
authRouter.post('/register', validRegister, registerController);

/**
 * Route to verify the provided email.
 * @name get/api/auth/user/activate
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} callback - Express callback.
 */
authRouter.get('/activate/:token', verifyController);

/**
 * Route to authenticate an existing user.
 * @name post/api/auth/user/login
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.post('/login', validLogin, loginController);

/**
 * Route to get the user information of the authenticated user.
 * @name post/api/auth/user/information
 * @access private
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.get('/information', auth, informationController);

//* --------------------- EXPORTS --------------------- *\\

export default authRouter;
