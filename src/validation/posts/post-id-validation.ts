import {NextFunction, Request, Response} from "express";
import {postsCollection} from "../../db/db";
import {postsServices} from "../../services/posts-services";
import {bloggersRepository} from "../../repositories/bloggers-repository";
import {postsRepository} from "../../repositories/posts-repository";


export const postIdValidation = (req: Request, res: Response, next: NextFunction) => {

    const postId = +req.params.postId || +req.params.id || null
    const exist = postId ? postsServices.getPostById(postId) : null
    if (!exist) {
        res.status(404)
        return
    } else {
        next()
    }

    // const postId = +req.params.id
    //
    // if (!postsCollection.findOne({id: postId})) {
    //     res.status(404)
    //     return
    // } else {
    //     next()
    // }

    // const postId = +req.params.bloggerId || +req.params.id ||  null
    // if(postId && !await postsRepository.getPostById(postId)) {
    //     res.sendStatus(404)
    //     return
    // } else next()
};