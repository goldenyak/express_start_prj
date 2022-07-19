import {Request, Response, Router} from 'express'
import {bloggers, errorsMessages, videos} from "../repositories/db";
import {bloggersRepository} from "../repositories/bloggers-repository";

// put here array with videos
export const bloggersRouter = Router({})

bloggersRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
});
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const foundBlogger = bloggersRepository.getBloggerById(+req.params.id)
    if (foundBlogger) {
        res.status(200).send(foundBlogger)
        return;
    }
    res.sendStatus(404);
})
bloggersRouter.post('/', (req: Request, res: Response) => {
    const newBlogger = bloggersRepository.createNewBlogger(req.body.name, req.body.youtubeUrl)
    newBlogger && res.status(201).send(newBlogger)

    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl

    if (!name || !name.match('[Aa-zZ]+') || name.length > 15) {
        errorsMessages.errorsMessages.push({
            "message": "name incorrect",
            "field": "name"
        })
    }
    if (!youtubeUrl || youtubeUrl.length > 100 || !youtubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
        errorsMessages.errorsMessages.push({
            "message": "youtubeUrl incorrect",
            "field": "youtubeUrl"
        })
    }

    if (errorsMessages.errorsMessages.length > 0) {
        res.status(400).json(errorsMessages)
        res.end()
        errorsMessages.errorsMessages = []
        return
    }
})
bloggersRouter.put('/:id', (req: Request, res: Response) => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    const newName = req.body.name
    const newYoutubeUrl = req.body.youtubeUrl

    if (!newName || !newName.match('[Aa-zZ]+') || newName.length > 15) {
        errorsMessages.errorsMessages.push({
            "message": "name incorrect",
            "field": "name"
        })
    }
    if (!newYoutubeUrl || !newYoutubeUrl.trim() || newYoutubeUrl.length > 100 || !newYoutubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
        errorsMessages.errorsMessages.push({
            "message": "youtubeUrl incorrect",
            "field": "youtubeUrl"
        })
    }

    if (errorsMessages.errorsMessages.length > 0) {
        res.status(400).json(errorsMessages)
        res.end()
        errorsMessages.errorsMessages = []
        return
    }

    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers[i].name = req.body.name
            bloggers[i].youtubeUrl = newYoutubeUrl
            res.sendStatus(204)
            return;
        }
    }

    res.sendStatus(404)
})
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedBlogger = bloggersRepository.deleteBloggerById(+req.params.id)
    deletedBlogger && res.sendStatus(204)

    if (bloggers.filter(el => el.id !== +req.params.id)) {
        res.sendStatus(404)
        return;
    }
})