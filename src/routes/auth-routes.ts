import {Request, Response, Router} from "express";
import {userServices} from "../services/user-services";
import {inputValidation} from "../validation/errors/input-validation";
import {authServices} from "../services/auth-services";
import bcrypt from "bcrypt";


export const authRouter = Router({});

authRouter.post('/registration', async (req: Request, res: Response) => {
    const {login, password, email} = req.body
    try {
        const isUsed = await userServices.getUserByLogin(login)
        const isEmail = await authServices.checkEmail(email)
        if (isUsed) {
            return res.json({
                message: "Данный username уже занят!"
            })
        }
        if (isEmail) {
            return res.json({
                message: "Данный email уже занят!"
            })
        }

        const createdUser = await authServices.registerUser(login, password, email)
        if(createdUser) {
            return res.json({
                message: "USPEH"
            })
        }

    } catch (error) {
        res.sendStatus(400)
    }
});

authRouter.post('/login',
    inputValidation,
    async (req: Request, res: Response) => {
        try {
            const {login, password} = req.body
            const findUser = await userServices.getUserByLogin(login)
            if (!findUser) {
                res.status(401).json(
                    "Invalid name"
                )
                return
            }

            const isPasswordCorrect = await authServices.checkPassword(password, findUser.accountData.password)
            if (!isPasswordCorrect) {
                res.status(401).json(
                    "Invalid password"
                )
                return
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

authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {

});

authRouter.post('/registration-email-resending', async (req: Request, res: Response) => {

});