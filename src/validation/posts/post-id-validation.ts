import {NextFunction, Request, Response} from "express";
import {postsCollection} from "../../db/db";
import {postsServices} from "../../services/posts-services";


export const postIdValidation = (req: Request, res: Response, next: NextFunction) => {
    const postId = +req.params.id

    if (!postsCollection.findOne({id: postId})) {
        res.status(404)
        return
    } else {
        next()
    }
};