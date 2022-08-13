import {Request, Response, Router} from "express";
import {commentsServices} from "../services/comments-services";
import {authMiddleware} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {inputValidation} from "../validation/errors/input-validation";


export const commentsRouter = Router({})

commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const commentById = await commentsServices.getCommentById(req.params.id)
        if (commentById) {
            res.status(200).json(commentById)
            return
        } else {
            res.sendStatus(404)
            return
        }

    }
);

commentsRouter.put('/:commentId',
    authMiddleware,
    body('content').trim().notEmpty().isLength({min: 20, max: 300}),
    inputValidation,
    async (req: Request, res: Response) => {
        const isCommentId = await commentsServices.getCommentById(req.params.commentId)

        if (isCommentId?.userId === req.user?._id.toString()) {
            console.log(isCommentId?.userId === req.user?._id.toString())
            await commentsServices.updateCommentById(req.params.commentId, req.body.content)
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }
    }
);

commentsRouter.delete('/:commentId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isCommentId = await commentsServices.getCommentById(req.params.commentId)

        // if (isCommentId?.userId === req.user?._id.toString()) {
        //     await commentsServices.deleteComment(req.params.commentId)
        //     res.sendStatus(204)
        //     return
        // } else {
        //     res.sendStatus(404)
        //     return
        // }
        // res.sendStatus(403)
        // return

        if (isCommentId?.userId === req.user?._id.toString()) {
            await commentsServices.deleteComment(req.params.commentId)
            res.sendStatus(204)
            return
        }
        if(isCommentId?.userId !== req.user?._id.toString()) {
            res.sendStatus(403)
            return
        }
        if(!isCommentId?.userId) {
            res.sendStatus(404)
            return
        }
    }
);