import {Request, Response, Router} from 'express'
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {youtubeUrlValidation} from "../validation/bloggers/youtube-url-validation";
import {bloggerNameValidation} from "../validation/bloggers/blogger-name-validation";
import {bloggerIdValidation} from "../validation/bloggers/blogger-id-validation";
import {inputValidation} from "../validation/errors/input-validation";
import * as QueryString from "querystring";

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const SearchNameTerm: any = req.query
    const bloggers = await bloggersRepository.getAllBloggers(SearchNameTerm)
    res.status(200).send(bloggers)
});
bloggersRouter.get('/:id', bloggerIdValidation, async (req: Request, res: Response) => {
    const foundBlogger = await bloggersRepository.getBloggerById(+req.params.id)
    if (foundBlogger) {
        res.status(200).send(foundBlogger)
        return;
    }
    res.sendStatus(404);
})
bloggersRouter.post('/', authMiddleware, bloggerNameValidation, youtubeUrlValidation, inputValidation, async (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body

    const newBlogger = await bloggersRepository.createNewBlogger(name, youtubeUrl)
    newBlogger && res.status(201).send(newBlogger)
})

bloggersRouter.put('/:id', authMiddleware, bloggerIdValidation, youtubeUrlValidation, bloggerNameValidation, inputValidation, async (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const {id} = req.params

    const updatedBlogger = await bloggersRepository.updateBloggerById(name, youtubeUrl, +id)
    updatedBlogger && res.sendStatus(204)
    return;
})
bloggersRouter.delete('/:id', authMiddleware, bloggerIdValidation, async (req: Request, res: Response) => {
    await bloggersRepository.deleteBloggerById(+req.params.id)
    res.sendStatus(204)
    return;
})