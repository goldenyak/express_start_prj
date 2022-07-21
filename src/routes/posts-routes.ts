import {Request, Response, Router} from 'express'
import {bloggers, errorsMessages, posts} from "../repositories/db";
import {postsRepository} from "../repositories/posts-repository";
import {postIdValidation} from "../validation/posts/post-id-validation";
import {body, validationResult} from "express-validator";
import {errorsAdapt} from "../utils";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {titleValidation} from "../validation/posts/title-validation";
import {
    shortDescriptionValidation
} from "../validation/posts/short-description-validation";
import {contentValidation} from "../validation/posts/content-validation";
import {inputValidation} from "../validation/errors/input-validation";

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts()
    res.status(200).send(posts)
    res.end()
});
postsRouter.get('/:id', postIdValidation, (req: Request, res: Response) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
    //     res.end()
    //     return
    // }
    const postById = postsRepository.getPostsById(+req.params.id)
    res.status(200).send(postById)
    res.end()

})

postsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidation,
    body('bloggerId').custom((value) => !!bloggersRepository.getBloggerById(value)),
    (req: Request, res: Response) => {

        const {title, shortDescription, content, bloggerId} = req.body
        const blogger = bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            res.status(201).send(postsRepository.createNewPost(title, shortDescription, content, bloggerId, blogger.name))
            res.end()
            return
        }
    })

postsRouter.put('/:id', authMiddleware, postIdValidation, titleValidation, shortDescriptionValidation, contentValidation, inputValidation,
    body('bloggerId').custom((value) => !!bloggersRepository.getBloggerById(value)), (req: Request, res: Response) => {

        const {title, shortDescription, content, bloggerId} = req.body
        const blogger = bloggersRepository.getBloggerById(bloggerId)
        blogger && postsRepository.updatePostById(+req.params.id, title, shortDescription, content, bloggerId)
        res.status(204)
        res.end()
    })


postsRouter.delete('/:id', authMiddleware, postIdValidation,
    (req: Request, res: Response) => {
    const postById = postsRepository.getPostsById(+req.params.id)
        if(postById) {
            postsRepository.deletePostById(+req.params.id)
            res.status(204)
            res.end()
            return
        } else {
            res.status(404)
            res.end()
            return
        }

})