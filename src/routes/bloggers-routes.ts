import {Request, Response, Router} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {youtubeUrlValidation} from "../validation/bloggers/youtube-url-validation";
import {bloggerNameValidation} from "../validation/bloggers/blogger-name-validation";
import {bloggerIdValidation} from "../validation/bloggers/blogger-id-validation";
import {inputValidation} from "../validation/errors/input-validation";
import {bloggerServices} from "../services/blogger-services";
import {param, query} from "express-validator";

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm?.toString()
    const pageNumber = req.query.pageNumber ? Number(req.query.PageNumber) : 1
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10

    const bloggers = await bloggerServices.getAllBloggers(pageNumber, pageSize, searchNameTerm)
    res.status(200).send(bloggers)
});
bloggersRouter.get('/:id', bloggerIdValidation, async (req: Request, res: Response) => {
    const foundBlogger = await bloggerServices.getBloggerById(+req.params.id)
    if (foundBlogger) {
        res.status(200).send(foundBlogger)
        return;
    }
    res.sendStatus(404);
})
bloggersRouter.post('/', authMiddleware, bloggerNameValidation, youtubeUrlValidation, inputValidation, async (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body

    const newBlogger = await bloggerServices.createNewBlogger(name, youtubeUrl)
    res.status(201).send(newBlogger)
})

bloggersRouter.put('/:id', authMiddleware, bloggerIdValidation, youtubeUrlValidation, bloggerNameValidation, inputValidation, async (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const {id} = req.params

    const updatedBlogger = await bloggerServices.updateBloggerById(name, youtubeUrl, +id)
    updatedBlogger && res.sendStatus(204)
    return;
})
bloggersRouter.delete('/:id', authMiddleware, bloggerIdValidation, async (req: Request, res: Response) => {
    await bloggerServices.deleteBloggerById(+req.params.id)
    res.sendStatus(204)
    return;
})
bloggersRouter.get('/:bloggerId/posts',
    bloggerIdValidation,
    param('bloggerId').isInt(),
    query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}),
    async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10

        res.status(200).send(await bloggerServices.getBloggerPosts(pageNumber, pageSize, +req.params.bloggerId))
        return
    })