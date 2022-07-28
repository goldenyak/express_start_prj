import {NextFunction, Request, Response} from "express";
import {postsCollection} from "../../db/db";


export const postIdValidation = (req: Request, res: Response, next: NextFunction) => {
    const bloggerId = +req.params.id || null

    if (!postsCollection.findOne({id: bloggerId})) {
        res.status(404)
        return
    } else {
        next()
    }
};