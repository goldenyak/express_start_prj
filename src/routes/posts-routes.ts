import {Request, Response, Router} from 'express'
import {postsRepository} from "../repositories/posts-repository";
import {postIdValidation} from "../validation/posts/post-id-validation";
import {body, query} from "express-validator";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {titleValidation} from "../validation/posts/title-validation";
import {
    shortDescriptionValidation
} from "../validation/posts/short-description-validation";
import {contentValidation} from "../validation/posts/content-validation";
import {inputValidation} from "../validation/errors/input-validation";
import {bloggerServices} from "../services/blogger-services";
import {postsServices} from "../services/posts-services";
import {bloggerIdValidation} from "../validation/bloggers/blogger-id-validation";

export const postsRouter = Router({})

postsRouter.get('/',
    query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}),
    inputValidation,
    async (req: Request, res: Response) => {

        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10

        const posts = await postsServices.getAllPosts(pageNumber, pageSize)
        res.status(200).send(posts)
        return;
    });

postsRouter.get('/:id',
    postIdValidation,
    async (req: Request, res: Response) => {
        const foundPost = await postsServices.getPostById(+req.params.id)
        if (foundPost) {
            res.status(200).send(foundPost)
            return;
        }
        res.sendStatus(404);
    })

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    body('bloggerId').custom(async value => {
        if (!await bloggersRepository.getBloggerById(value)) {
            return Promise.reject();
        }
    }),
    inputValidation,
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, bloggerId} = req.body
        res.status(201).send(await postsServices.createNewPost(title, shortDescription, content, bloggerId))
        return;
    })

postsRouter.put('/:id',
    authMiddleware,
    // bloggerIdValidation,
    postIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    body('bloggerId').custom(async value => {
        if (!await bloggersRepository.getBloggerById(value)) {
            return Promise.reject();
        }
    }),
    inputValidation,
    async (req: Request, res: Response) => {

        const {title, shortDescription, content, bloggerId} = req.body
        // const blogger = await bloggersRepository.getBloggerById(bloggerId)
        await postsServices.updatePostById(+req.params.id, title, shortDescription, content, bloggerId)
        res.sendStatus(204)
        return
    })


postsRouter.delete('/:id',
    authMiddleware,
    postIdValidation,
    inputValidation,
    async (req: Request, res: Response) => {

        await postsServices.deletePostById(+req.params.id)

        res.sendStatus(204)
        return

     })