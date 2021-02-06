//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import { check } from 'express-validator';

//* ---------------- Auth Valdidations ---------------- *\\
const validRegister = [
  check('email', 'email field is required')
    .notEmpty()
    .isLength({ min: 6, max: 32 }),
  check('password', 'password field is required').notEmpty(),
  check('firstName', 'first name field is required')
    .notEmpty()
    .isLength({ max: 32 }),
  check('lastName', 'last name field is required')
    .notEmpty()
    .isLength({ max: 32 }),

  check('email', 'email cant be longer than 24 characters').isLength({
    max: 24,
  }),
  check(
    'password',
    'please enter a password with 6 to 32 characters'
  ).isLength({ min: 6, max: 32 }),
  check('firstName', 'firstName cant be longer than 24 characters').isLength({
    max: 24,
  }),
  check('lastName', 'lastName cant be longer than 24 characters').isLength({
    max: 24,
  }),

  check('email', 'please include a valid email').isEmail(),
];

const validLogin = [
  check('email', 'email field is required').notEmpty(),
  check('password', 'password field is required').notEmpty(),

  check('email', 'email cant be longer than 24 characters').isLength({
    max: 24,
  }),
  check(
    'password',
    'please enter a password with 6 to 32 characters'
  ).isLength({ min: 6, max: 32 }),

  check('email', 'please include a valid email').isEmail().not(),
];

const validActivate = [check('token', 'token field is required').notEmpty()];

const validForgotPassword = [
  check('email', 'email field is required').notEmpty(),

  check('email', 'email cant be longer than 24 characters').isLength({
    max: 24,
  }),

  check('email', 'please include a valid email').isEmail().not(),
];

const validResetPassword = [
  check('token', 'token field is required').notEmpty(),
  check('password', 'password field is required').notEmpty(),

  check(
    'password',
    'please enter a password with 6 to 32 characters'
  ).isLength({ min: 6, max: 32 }),
];

//* ---------------- Mail Valdidations ---------------- *\\
const validMail = [
  check('to', 'to field is required').notEmpty(),
  check('subject', 'subject field is required').notEmpty(),
  check('html', 'html field is required').notEmpty(),

  check('to', 'to cant be longer than 24 characters').isLength({
    max: 24,
  }),
  check('subject', 'subject cant be longer than 64 characters').isLength({
    max: 64,
  }),

  check('to', 'to must be a valid email').isEmail().not(),
];

//* --------------------- EXPORTS --------------------- *\\

export {
  validRegister,
  validLogin,
  validActivate,
  validForgotPassword,
  validResetPassword,
  validMail,
};
