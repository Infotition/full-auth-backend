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
  resetPasswordController,
  forgotPasswordController,
  informationController,
} from '../controllers/auth.controller';

//* Utils import
import {
  validRegister,
  validLogin,
  validActivate,
  validResetPassword,
  validForgotPassword,
} from '../utils/valid';

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
 * Route to verify the provided email.
 * @name post/api/auth/user/activate
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.post('/activate', validActivate, verifyController);

/**
 * Route to reset the user password.
 * @name post/api/auth/user/reset
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.post('/forgot', validForgotPassword, forgotPasswordController);

/**
 * Route to reset the user password.
 * @name post/api/auth/user/reset
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {callback} callback - Express callback.
 */
authRouter.post('/reset', validResetPassword, resetPasswordController);

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
