import {body} from "express-validator";

export const titleValidation =  body('title').trim().notEmpty().isLength({max: 30})
