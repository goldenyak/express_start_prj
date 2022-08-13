import {Request, Response, Router} from "express";
import {userServices} from "../services/user-services";
import {inputValidation} from "../validation/errors/input-validation";
import {authServices} from "../services/auth-services";


export const authRouter = Router({});

authRouter.post('/login',
    inputValidation,
    async (req: Request, res: Response) => {
        try {
            const {login, password} = req.body

            const findUser = await userServices.findUser(login)
            if (!findUser) {
                res.sendStatus(401)
                return
                // res.status(401).json({
                //     message: "Такого имени пользователя не существует."
                // })
                // return
            }

            const isPasswordCorrect = await userServices.checkPassword(login, password);
            if (!isPasswordCorrect) {
                res.sendStatus(401)
                return
                // res.status(401).json({
                //     message: "Вы ввели неправильный пароль"
                // })
                // return
            }

            const token = await authServices.createToken(login);
            res.status(200).json({
                token
            })
            return;

        } catch (error) {
            console.error(error)
        }

    });