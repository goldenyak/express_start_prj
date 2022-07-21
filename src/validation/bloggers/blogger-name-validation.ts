import {body} from "express-validator";

export const bloggerNameValidation = body('name').isLength({max: 15}).trim().isLength({max: 15}).isString()