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
        const isCommentById = await commentsServices.getCommentById(req.params.commentId)

        if (isCommentById) {
            const currentUserId = req.user!._id.toString()
            if (currentUserId === isCommentById.userId) {
                await commentsServices.updateCommentById(req.params.commentId, req.body.content)
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(403)
                return
            }
        } else {
            res.sendStatus(404)
            return
        }
    }
);

commentsRouter.delete('/:commentId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isCommentById = await commentsServices.getCommentById(req.params.commentId)

        if (isCommentById) {
            const currentUserId = req.user!._id.toString()
            if (currentUserId === isCommentById.userId) {
                await commentsServices.deleteComment(req.params.commentId)
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(403)
                return
            }
        } else {
            res.sendStatus(404)
            return
        }
    }
);