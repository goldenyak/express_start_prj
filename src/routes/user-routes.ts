import {Request, Response, Router} from "express";
import {userServices} from "../services/user-services";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../validation/errors/input-validation";
import {userIdValidation} from "../validation/users/user-id-validation";


export const userRouter = Router({});

userRouter.get('/',
    async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10

        const users = await userServices.getAllUsers(pageNumber, pageSize);
        res.status(200).send(users)
        return;
    });

userRouter.get('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        res.status(200).send(await userServices.getUserById(req.params.id))
        return;
    });

userRouter.post('/',
    authMiddleware,
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    inputValidation,
    async (req: Request, res: Response) => {
        try {
            const {login, password} = req.body

            const isUsed = await userServices.findUser(login)
            if (isUsed) {
                return res.json({
                    message: "Данный username уже занят!"
                })
            }
            await userServices.createNewUser(login, password);
            res.sendStatus(201)
            return

        } catch (error) {
            res.status(400).json({
                message: "Ошибка при создании пользователя"
            })
        }

        res.sendStatus(401)
        return
    },

    userRouter.delete('/:id',
        authMiddleware,
        userIdValidation,
        inputValidation,
        async (req: Request, res: Response) => {
            await userServices.deleteUserById(req.params.id)
            res.sendStatus(204)
            return
        }
    )
)