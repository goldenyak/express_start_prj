import express, {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import {videosRouter} from "./routes/videos-routes";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";
import {authMiddleware} from "./middlewares/auth-middleware";
import {runDb} from "./repositories/db";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/videos', videosRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

const port = process.env.PORT || 5000

const start = async () => {
    // await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.pfyw1.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    await runDb();
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
}
start();