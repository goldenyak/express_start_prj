import {body} from "express-validator";

export const titleValidation = body('title').trim().isLength({min: 2, max: 40});
