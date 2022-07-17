import {Request, Response, Router} from 'express'
import {videos} from "../repositories/db";

// put here array with videos
export const videosRouter = Router({})

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos)
})
videosRouter.get('/:videoId', (req: Request, res: Response) => {
    // const id = +req.params.videoId;
    let videoById = videos.find(el => el.id === +req.params.videoId)
    if (videoById) {
        res.status(200).send(videoById)
    } else {
        res.sendStatus(404)
    }
})
videosRouter.post('/', (req: Request, res: Response) => {
    const title = req.body.title
    if (!title || !title.trim() || title.length > 40) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "title"
                }
            ]
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: "Egor Yakovlev"
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})
videosRouter.put('/:id', (req: Request, res: Response) => {
    const title = req.body.title
    if (!title || !title.trim() || title.length > 40) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "title"
                }
            ]
        })
        return;
    }

    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos[i].title = req.body.title
            res.sendStatus(204)
            return;
        }
    }

    res.sendStatus(404)
})
videosRouter.delete('/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.sendStatus(204)
            return;
        }
    }

    if (videos.filter(el => el.id !== +req.params.id)) {
        res.sendStatus(404)
        return;
    }
})