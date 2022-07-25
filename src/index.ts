import express, {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import {videosRouter} from "./routes/videos-routes";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";
import {authMiddleware} from "./middlewares/auth-middleware";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/videos', videosRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})