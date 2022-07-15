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
const bloggers = [
    {id: 1, name: 'Ivan', youtubeUrl: 'youtube.com/Ivan'},
    {id: 2, name: 'Egor', youtubeUrl: 'youtube.com/Egor'},
    {id: 3, name: 'Roma', youtubeUrl: 'youtube.com/Roma'},
    {id: 4, name: 'Maksim', youtubeUrl: 'youtube.com/Maksim'},
    {id: 5, name: 'Dima', youtubeUrl: 'youtube.com/Dima'},

]
const posts = [
    {
        id: 1,
        title: "Post 1",
        shortDescription: "Description for post 1",
        content: "Content for post 1",
        bloggerId: 1,
        bloggerName: "some bloggers name"
    },
    {
        id: 2,
        title: "Post 2",
        shortDescription: "Description for post 2",
        content: "Content for post 2",
        bloggerId: 2,
        bloggerName: "some bloggers name"
    },
    {
        id: 3,
        title: "Post 3",
        shortDescription: "Description for post 3",
        content: "Content for post 3",
        bloggerId: 3,
        bloggerName: "some bloggers name"
    }
]

// videos API
app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    // const id = +req.params.videoId;
    let videoById = videos.find(el => el.id === +req.params.videoId)
    if (videoById) {
        res.status(200).send(videoById)
    } else {
        res.sendStatus(404)
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
            res.sendStatus(204)
            return;
        }
    }

    res.sendStatus(404)
})
app.delete('/videos/:id', (req: Request, res: Response) => {
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

// bloggers API
app.get('/bloggers', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
});
app.get('/bloggers/:id', (req: Request, res: Response) => {
    let bloggerById = bloggers.find(el => el.id === +req.params.id)
    if (bloggerById) {
        res.status(200).send(bloggerById)
        return;
    }
    res.sendStatus(404);
})
app.post('/bloggers', (req: Request, res: Response) => {
    // const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const errorsMessages: any = {
        "errorsMessages": []
    };

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
    // if (!pattern.test(youtubeUrl)) {
    //     errorsMessages.errorsMessages.push({
    //         "message": "youtubeUrl incorrect",
    //         "field": "youtubeUrl"
    //     })
    // }

    if (errorsMessages.errorsMessages.length > 0) {
        res.status(400).json(errorsMessages)
        res.end()
        errorsMessages.errorsMessages = []
        return
    }

    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})
app.put('/bloggers/:id', (req: Request, res: Response) => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    const newName = req.body.name
    const newYoutubeUrl = req.body.youtubeUrl
    const errorsMessages: any = {
        "errorsMessages": []
    };

    if (!newName || !newName.trim() || newName.length > 15) {
        errorsMessages.errorsMessages.push({
            "message": "name incorrect",
            "field": "name"
        })
    }
    if (!newYoutubeUrl || !newYoutubeUrl.trim() || newYoutubeUrl.length > 100) {
        errorsMessages.errorsMessages.push({
            "message": "youtubeUrl incorrect",
            "field": "youtubeUrl"
        })
    }
    if (!pattern.test(newYoutubeUrl)) {
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
app.delete('/bloggers/:id', (req: Request, res: Response) => {
    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1)
            res.sendStatus(204)
            return;
        }
    }

    if (bloggers.filter(el => el.id !== +req.params.id)) {
        res.sendStatus(404)
        return;
    }
})

// posts API
app.get('/posts', (req: Request, res: Response) => {
    res.status(200).send(posts)
});
app.get('/posts/:id', (req: Request, res: Response) => {
    let postById = posts.find(el => el.id === +req.params.id)
    if (postById) {
        res.status(200).send(postById)
        return;
    }
    if (!+req.params.id) {
        res.sendStatus(400).send("Bad Request")
        return;
    }
    res.sendStatus(404);
})
app.post('/posts', (req: Request, res: Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const foundBloggerId = bloggers.find(el => el.id === bloggerId)
    const errorsMessages: any = {
        "errorsMessages": []
    };

    if (!foundBloggerId) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "bloggerId"
                }
            ]
        })
        return;
        // errorsMessages.push({
        //     "message": "foundBloggerId incorrect",
        //     "field": "bloggerId"
        // })
    }
    if (!title || !title.trim() || title.length > 30) {
        errorsMessages.errorsMessages.push({
            "message": "title incorrect",
            "field": "title"
        })
    }
    if (!shortDescription || !shortDescription.trim() || shortDescription.length > 100) {
        errorsMessages.errorsMessages.push({
            "message": "shortDescription incorrect",
            "field": "shortDescription"
        })
    }
    if (!content || !content.trim() || content.length > 1000) {
        errorsMessages.errorsMessages.push({
            "message": "content incorrect",
            "field": "content"
        })
    }

    if (errorsMessages.errorsMessages.length > 0) {
        res.status(400).json(errorsMessages)
        res.end()
        errorsMessages.errorsMessages = []
        return
    }

    const newPost = {
        id: +(new Date()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: foundBloggerId.id,
        bloggerName: foundBloggerId.name
    }
    posts.push(newPost)
    res.status(201).send(newPost)
})
app.put('/posts/:id', (req: Request, res: Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const {id} = req.params
    const errorsMessages: any = {
        "errorsMessages": []
    };

    const foundPost = posts.find(el => el.id === +id)
    if (!foundPost) {
        res.sendStatus(404)
        return;
    }

    const foundBlogger = bloggers.find(el => el.id === +bloggerId)
    if (!foundBlogger) {
        res.sendStatus(404)
        return;
    }

    if (!title || !title.match('[Aa-zZ]+') || title.length > 30) {
        errorsMessages.errorsMessages.push({
            "message": "title incorrect",
            "field": "title"
        })
    }
    if (!shortDescription || shortDescription.length > 100) {
        errorsMessages.errorsMessages.push({
            "message": "shortDescription incorrect",
            "field": "shortDescription"
        })
    }
    if (!content || content.length > 1000) {
        errorsMessages.errorsMessages.push({
            "message": "content incorrect",
            "field": "content"
        })
    }
    if (!bloggerId || typeof bloggerId !== "number") {
        errorsMessages.errorsMessages.push({
            "message": "bloggerId incorrect",
            "field": "bloggerId"
        })
    }

    if (errorsMessages.errorsMessages.length > 0) {
        res.status(400).json(errorsMessages)
        res.end()
        errorsMessages.errorsMessages = []
        return
    }
    // if (errorsMessages.length !== 0) {
    //     res.sendStatus(400).send(errorsMessages)
    //     return;
    // }

    if (foundPost) {
        foundPost.title = title
        foundPost.shortDescription = shortDescription
        foundPost.content = content
        foundPost.bloggerId = bloggerId
        res.sendStatus(204).send(foundPost)
    }
})
app.delete('/posts/:id', (req: Request, res: Response) => {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === +req.params.id) {
            posts.splice(i, 1)
            res.sendStatus(204)
            return;
        }
    }

    if (posts.filter(el => el.id !== +req.params.id)) {
        res.sendStatus(404)
        return;
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})