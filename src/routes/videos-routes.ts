import {Request, Response, Router} from 'express'
import {videos} from "../repositories/db";
import {videosRepository} from "../repositories/videos-repository";
import {titleValidation} from "../validation/title-validation";
import {inputValidation} from "../validation/input-validation";

export const videosRouter = Router({})

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos);
})
videosRouter.get('/:videoId', (req: Request, res: Response) => {
    const foundVideo = videosRepository.getVideoById(+req.params.videoId)
    res.status(201).send(foundVideo)
})
videosRouter.post('/',
    titleValidation,
    inputValidation,
    (req: Request, res: Response) => {
        const newVideo = videosRepository.createVideo(req.body.title)
        res.status(201).send(newVideo)


        // if (!req.body.title || !req.body.title.trim() || req.body.title.length > 40) {
        //     res.status(400).send({
        //         "errorsMessages": [
        //             {
        //                 "message": "string",
        //                 "field": "title"
        //             }
        //         ]
        //     })
        //     return;
        // }
    })
videosRouter.put('/:id', (req: Request, res: Response) => {
    const isUpdated = videosRepository.updateVideoById(+req.params.id, req.body.title)
    if (isUpdated) {
        const updatedVideo = videosRepository.getVideoById(+req.params.id)
        res.status(201).send(updatedVideo)
    } else {
        res.sendStatus(404)
    }
    // const title = req.body.title
    // if (!title || !title.trim() || title.length > 40) {
    //     res.status(400).send({
    //         "errorsMessages": [
    //             {
    //                 "message": "string",
    //                 "field": "title"
    //             }
    //         ]
    //     })
    //     return;
    // }

})
videosRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedVideo = videosRepository.deleteVideoById(+req.params.id)
    if (deletedVideo) {
        const videos = videosRepository.getVideos()
        res.send(videos)
    } else {
        res.send("error")
    }


    // for (let i = 0; i < videos.length; i++) {
    //     if (videos[i].id === +req.params.id) {
    //         videos.splice(i, 1)
    //         res.sendStatus(204)
    //         return;
    //     }
    // }

    // if (videos.filter(el => el.id !== +req.params.id)) {
    //     res.sendStatus(404)
    //     return;
    // }
})

