import {body} from "express-validator";

export const contentValidation = body('content').trim().isLength({max: 1000});