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
                res.json({
                    message: "Такого имени пользователя не существует."
                })
            }

            const isPasswordCorrect = await userServices.checkPassword(login, password);
            if (!isPasswordCorrect) {
                res.json({
                    message: "Вы ввели неправильный пароль"
                })
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