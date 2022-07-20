import {NextFunction, Request, Response } from "express";
import {posts} from "../repositories/db";

export const postIdValidation = (req: Request, res: Response, next:NextFunction) => {
    const bloggerId = +req.params.id || null

    if(!posts.find(el => el.id === bloggerId)) {
        res.status(404)
        res.end()
        return
    } else next()
};