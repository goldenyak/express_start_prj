import {body} from "express-validator";

export const youtubeUrlValidation = body('youtubeUrl').exists().isLength({max: 100}).isURL()