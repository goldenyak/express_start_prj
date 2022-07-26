import {NextFunction, Request, Response} from "express";
import {client} from "../../repositories/db";

export const bloggerIdValidation = (req: Request, res: Response, next: NextFunction) => {
    const bloggerId = +req.params.id || null
    if (!client.db("express-project").collection("bloggers").findOne({id: bloggerId})) {
        res.status(404)
        return
    } else {
        next()
    }
};