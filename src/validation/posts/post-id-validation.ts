import {NextFunction, Request, Response} from "express";
import {postsCollection} from "../../db/db";
import {postsServices} from "../../services/posts-services";
import {bloggersRepository} from "../../repositories/bloggers-repository";
import {postsRepository} from "../../repositories/posts-repository";


export const postIdValidation = async (req: Request, res: Response, next: NextFunction) => {

    const postId = +req.params.bloggerId || +req.params.id ||  null
    if(postId && !await postsRepository.getPostById(postId)) {
        res.sendStatus(404)
        return
    } else next()
};