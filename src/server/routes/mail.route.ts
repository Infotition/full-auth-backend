//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import express, { Router } from 'express';

//* Controllers
import mailController from '../controllers/mail.controller';

//* Utils import
import { validMail } from '../utils/valid';

//* ------------------ CONFIGURATION ------------------ *\\

const mailRouter: Router = express.Router();

//* --------------------- ROUTES ---------------------- *\\

/**
 * Route registering a new user in the system.
 * @name post/api/auth/main/send
 * @access public
 * @function
 * @param {string} path - Express path
 * @param {function} controller - Express controller.
 */
mailRouter.post('/send', validMail, mailController);

//* --------------------- EXPORTS --------------------- *\\

export default mailRouter;
