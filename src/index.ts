import express, {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import {bloggers, posts, videos} from "./repositories/db";

const app = express();
app.use(cors());
app.use(bodyParser());
const port = process.env.PORT || 5000


const errorsMessages: any = {
    "errorsMessages": []
};

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

    const newBlogger = {
        id: +(new Date()),
        name: name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})
app.put('/bloggers/:id', (req: Request, res: Response) => {
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
// app.put('/posts/:id', (req: Request, res: Response) => {
//     const {title, shortDescription, content, bloggerId} = req.body
//     const {id} = req.params
//
//     const foundPost = posts.find(el => el.id === +id)
//     if (!foundPost) {
//         res.sendStatus(404)
//         return;
//     }
//
//     // const foundBlogger = bloggers.find(el => el.id === +bloggerId)
//     // if (!foundBlogger) {
//     //     res.sendStatus(404)
//     //     return;
//     // }
//
//     if (!title || !title.match('[Aa-zZ]+') || title.length > 30) {
//         errorsMessages.errorsMessages.push({
//             "message": "title incorrect",
//             "field": "title"
//         })
//     }
//     if (!shortDescription || !shortDescription.match('[Aa-zZ]+') || shortDescription.length > 100) {
//         errorsMessages.errorsMessages.push({
//             "message": "shortDescription incorrect",
//             "field": "shortDescription"
//         })
//     }
//     if (!content || !content.match('[Aa-zZ]+') || content.length > 1000) {
//         errorsMessages.errorsMessages.push({
//             "message": "content incorrect",
//             "field": "content"
//         })
//     }
//     if (!bloggerId || typeof bloggerId !== "number") {
//         errorsMessages.errorsMessages.push({
//             "message": "bloggerId incorrect",
//             "field": "bloggerId"
//         })
//     }
//
//     if (errorsMessages.errorsMessages.length > 0) {
//         res.status(400).json(errorsMessages)
//         res.end()
//         errorsMessages.errorsMessages = []
//         return
//     }
//
//     if (foundPost) {
//         foundPost.title = title
//         foundPost.shortDescription = shortDescription
//         foundPost.content = content
//         foundPost.bloggerId = bloggerId
//         res.sendStatus(204).send(foundPost)
//     }
// })
app.put('/posts/:id', (req: Request, res: Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const bloggerIndex = bloggers.findIndex(item => item.id === bloggerId)
    const postIndex = posts.findIndex(item => item.id === +req.params.id)

    if(postIndex<0) {
        res.status(404)
        res.end()
        return
    }

    if(!title || title.length>30 || !title.match('[Aa-zZ]+')) {
        errorsMessages.errorsMessages.push({ "message" : "Input error", "field": "title" })
    }
    if (!shortDescription || shortDescription.length>100 || !shortDescription.match('[Aa-zZ]+')) {
        errorsMessages.errorsMessages.push({ "message" : "Input error", "field": "shortDescription" })
    }
    if (!content || content.length>1000 || !content.match('[Aa-zZ]+')) {
        errorsMessages.errorsMessages.push({ "message" : "Input error", "field": "content" })
    }
    if (bloggerIndex<0) {
        errorsMessages.errorsMessages.push({ "message" : "Input error", "field": "bloggerId" })
    }

    if(errorsMessages.errorsMessages.length>0) {
        res.status(400).json(errorsMessages)
        res.end()
        errorsMessages.errorsMessages = []
        return
    }

    const newPost = {
        "id": +(new Date()),
        "title": title,
        "shortDescription": shortDescription,
        "content": content,
        "bloggerId": bloggerId,
        "bloggerName": bloggers[bloggerIndex].name

    }
    posts[postIndex].title = title
    posts[postIndex].shortDescription = shortDescription
    posts[postIndex].content = content
    posts[postIndex].bloggerId = bloggerId

    res.status(204)
    res.end()
    }
)
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