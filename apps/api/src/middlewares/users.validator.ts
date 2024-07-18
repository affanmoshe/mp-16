import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUserRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be between 3 and 32 characters long')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      'Username can only contain alphanumeric characters, underscores, dots, and dashes',
    )
    .not()
    .contains(' ')
    .withMessage('Username cannot contain spaces')
    .toLowerCase(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .isLength({ min: 3, max: 64 })
    .withMessage('Email must be between 3 and 64 characters long'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('referrerCode')
    .if(body('referrerCode').notEmpty())
    .isLength({ max: 8, min: 8 })
    .withMessage('Referal code invalid')
    .optional(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateUserUpdate = [
  body('username')
    .trim()
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be between 3 and 32 characters long')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      'Username can only contain alphanumeric characters, underscores, dots, and dashes',
    )
    .not()
    .contains(' ')
    .withMessage('Username cannot contain spaces')
    .toLowerCase(),
  body('email')
    .trim()
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .isLength({ min: 3, max: 64 })
    .withMessage('Email must be between 3 and 64 characters long'),
  body('firstname')
    .trim()
    .optional()
    .isLength({ max: 64 })
    .withMessage('Firstname must be fewer or equal to 64 characters long'),
  body('lastname')
    .trim()
    .optional()
    .isLength({ max: 64 })
    .withMessage('Lastname must be fewer or equal to 64 characters long'),
  body('birthDate')
    .trim()
    .optional()
    .toDate()
    .isISO8601()
    .withMessage('Birth date is invalid'),
  body('phone')
    .trim()
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number'),
  body('gender')
    .optional()
    .isIn(['FEMALE', 'MALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY'])
    .withMessage(
      'Gender must be one of: FEMALE, MALE, NON_BINARY, PREFER_NOT_TO_SAY',
    ),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

// IMPORTANT: for reset password only!
export const validateResetPassword = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
