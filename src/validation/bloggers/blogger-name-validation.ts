import {body} from "express-validator";

export const bloggerNameValidation = body("name").trim().isLength({min: 1, max: 15});