import {body} from "express-validator";

export const bloggerNameValidation = body("name").isLength({min: 1, max: 15});