import {Request, Response, Router} from 'express'
import {bloggers, errorsMessages, videos} from "../repositories/db";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {youtubeUrlValidation} from "../validation/youtube-url-validation";
import {bloggerNameValidation} from "../validation/blogger-name-validation";
import {validationResult} from "express-validator";
import {errorsAdapt} from "../utils";

// put here array with videos
export const bloggersRouter = Router({})

bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getAllBloggers()
    res.status(200).send(bloggers)
    res.end()
});
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const foundBlogger = bloggersRepository.getBloggerById(+req.params.id)
    if (foundBlogger) {
        res.status(200).send(foundBlogger)
        return;
    }
    res.sendStatus(404);
})
bloggersRouter.post('/', authMiddleware, youtubeUrlValidation, bloggerNameValidation, (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }

    const newBlogger = bloggersRepository.createNewBlogger(name, youtubeUrl)
    newBlogger && res.status(201).send(newBlogger)
    res.end()

    // if (!name || !name.match('[Aa-zZ]+') || name.length > 15) {
    //     errorsMessages.errorsMessages.push({
    //         "message": "name incorrect",
    //         "field": "name"
    //     })
    // }
    // if (!youtubeUrl || youtubeUrl.length > 100 || !youtubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
    //     errorsMessages.errorsMessages.push({
    //         "message": "youtubeUrl incorrect",
    //         "field": "youtubeUrl"
    //     })
    // }
    // if (errorsMessages.errorsMessages.length > 0) {
    //     res.status(400).json(errorsMessages)
    //     res.end()
    //     errorsMessages.errorsMessages = []
    //     return
    // }
})
bloggersRouter.put('/:id', authMiddleware, youtubeUrlValidation, bloggerNameValidation, (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const {id} = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).send({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }

    const updatedBlogger = bloggersRepository.updateBloggerById(name, youtubeUrl, +id)
    updatedBlogger && res.sendStatus(204)
    res.end()

    // res.sendStatus(404)
})
bloggersRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    if (bloggers.filter(el => el.id !== +req.params.id)) {
        res.sendStatus(404)
        return;
    }

    bloggersRepository.deleteBloggerById(+req.params.id)
    res.sendStatus(204)
    res.end()
    return;
})