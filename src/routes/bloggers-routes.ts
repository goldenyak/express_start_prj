import {Request, Response, Router} from 'express'
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {youtubeUrlValidation} from "../validation/bloggers/youtube-url-validation";
import {bloggerNameValidation} from "../validation/bloggers/blogger-name-validation";
import {bloggerIdValidation} from "../validation/bloggers/blogger-id-validation";
import {inputValidation} from "../validation/errors/input-validation";

// put here array with videos
export const bloggersRouter = Router({})

bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getAllBloggers()
    res.status(200).send(bloggers)
    // res.end()
});
bloggersRouter.get('/:id', bloggerIdValidation, (req: Request, res: Response) => {
    const foundBlogger = bloggersRepository.getBloggerById(+req.params.id)
    if (foundBlogger) {
        res.status(200).send(foundBlogger)
        return;
    }
    res.sendStatus(404);
})
bloggersRouter.post('/', authMiddleware, bloggerNameValidation, youtubeUrlValidation, inputValidation, (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    console.log('ROURE_NAME =', name)
    console.log('ROUTE_URL ==', youtubeUrl)

    const newBlogger = bloggersRepository.createNewBlogger(name, youtubeUrl)
    newBlogger && res.status(201).send(newBlogger)
    // res.end()
})

bloggersRouter.put('/:id', authMiddleware, bloggerIdValidation, youtubeUrlValidation, bloggerNameValidation, inputValidation, (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const {id} = req.params

    const updatedBlogger = bloggersRepository.updateBloggerById(name, youtubeUrl, +id)
    updatedBlogger && res.sendStatus(204)
    return;
})
bloggersRouter.delete('/:id', authMiddleware, bloggerIdValidation, (req: Request, res: Response) => {
    bloggersRepository.deleteBloggerById(+req.params.id)
    res.sendStatus(204)
    // res.end()
    return;
})