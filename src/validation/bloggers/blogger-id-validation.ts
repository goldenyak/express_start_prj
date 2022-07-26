import {NextFunction, Request, Response } from "express";
import {bloggers} from "../../repositories/db";

export const bloggerIdValidation = (req: Request, res: Response, next:NextFunction) => {
    const bloggerId = +req.params.id || null
    if(!bloggers.find(el => el.id === bloggerId)) {
        res.status(404)
        res.end()
        return
    } else next()
};