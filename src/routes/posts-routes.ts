import {Request, Response, Router} from 'express'
import {bloggers, errorsMessages, posts, videos} from "../repositories/db";

// put here array with videos
export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(posts)
});
postsRouter.get('/:id', (req: Request, res: Response) => {
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
postsRouter.post('/', (req: Request, res: Response) => {
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
postsRouter.put('/:id', (req: Request, res: Response) => {
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
    })
postsRouter.delete('/:id', (req: Request, res: Response) => {
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