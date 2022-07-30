import {NextFunction, Request, Response} from "express";
import {bloggersCollection} from "../../db/db";

export const bloggerIdValidation = (req: Request, res: Response, next: NextFunction) => {
    const bloggerId = +req.params.id
    if (!bloggersCollection.findOne({id: bloggerId})) {
        res.status(404)
        return
    } else {
        next()
    }
};