import {body} from "express-validator";

export const youtubeUrlValidation = body('youtubeUrl').isLength({max: 100}).isURL()