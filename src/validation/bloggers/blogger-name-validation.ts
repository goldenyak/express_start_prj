import {body} from "express-validator";

export const bloggerNameValidation = body('name').trim().isLength({max: 15}).isString();