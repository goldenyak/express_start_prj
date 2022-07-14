import express, {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser());
const port = process.env.PORT || 5000

const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]
app.get('/', (req: Request, res: Response) => {
    res.send("Салют, мэн)))")
})
app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    // const id = +req.params.videoId;
    let videoById = videos.find(el => el.id === +req.params.videoId)
    if (videoById) {
        res.status(200).send(videoById)
    } else {
        res.send(404)
    }
})
app.post('/videos', (req: Request, res: Response) => {
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
app.put('/videos/:id', (req: Request, res: Response) => {
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
            res.status(204)
            return;
        }
    }

    res.status(404)
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.status(204)
            return;
        }
    }

    if (videos.filter(el => el.id !== +req.params.id)) {
        res.sendStatus(404)
        return;
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})