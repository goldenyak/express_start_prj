import express, {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import {bloggers, posts, videos} from "./repositories/db";
import {videosRouter} from "./routes/videos-routes";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";

const app = express();
app.use('/videos', videosRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use(cors());
app.use(bodyParser());
const port = process.env.PORT || 5000

// videos API

// bloggers API

// posts API



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})