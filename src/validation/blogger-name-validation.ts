import {body} from "express-validator";

export const bloggerNameValidation = body('name').trim().exists().isLength({min: 1, max: 15}).isString()