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

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts()
    res.status(200).send(posts)
});
postsRouter.get('/:id', postIdValidation, async (req: Request, res: Response) => {
    const postById = await postsRepository.getPostsById(+req.params.id)
    res.status(200).send(postById)


})

postsRouter.post('/',
    authMiddleware,
    body('bloggerId').custom((value) => !!bloggersRepository.getBloggerById(value)),
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, bloggerId} = req.body
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            res.status(201).send(postsRepository.createNewPost(title, shortDescription, content, bloggerId, blogger.name))

        }
    })

postsRouter.put('/:id',
    authMiddleware,
    postIdValidation,
    body('bloggerId').custom((value) => !!bloggersRepository.getBloggerById(value)),
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    async (req: Request, res: Response) => {

        const {title, shortDescription, content, bloggerId} = req.body
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        blogger && await postsRepository.updatePostById(+req.params.id, title, shortDescription, content, bloggerId)
        res.sendStatus(204)
    })


postsRouter.delete('/:id', authMiddleware, postIdValidation,
    async (req: Request, res: Response) => {
        const postById = await postsRepository.getPostsById(+req.params.id)
        if (postById) {
            await postsRepository.deletePostById(+req.params.id)
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }

    })