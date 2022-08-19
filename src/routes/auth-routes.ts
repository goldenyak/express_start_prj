import {Request, Response, Router} from "express";
import {userServices} from "../services/user-services";
import {inputValidation} from "../validation/errors/input-validation";
import {authServices} from "../services/auth-services";
import {body} from "express-validator";
import {usersRepository} from "../repositories/users-repository";
import {userLoginValidation} from "../validation/users/user-login-validation";
import {userEmailValidation} from "../validation/users/user-email-validation";


export const authRouter = Router({});

authRouter.post('/registration',
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    body('email').isEmail(),
    userLoginValidation,
    userEmailValidation,
    inputValidation,
    async (req: Request, res: Response) => {
    const {login, password, email} = req.body
    try {
        const createdUser = await authServices.registerUser(login, password, email)
        if (createdUser) {
            res.sendStatus(204).json("User is was created")
        }

    } catch (error) {
        res.sendStatus(400)
    }
});

authRouter.post('/login',
    body('login').trim().exists().isLength({min: 3, max: 10}),
    body('password').trim().exists().isLength({min: 6, max: 20}),
    inputValidation,
    async (req: Request, res: Response) => {
        try {
            const {login, password} = req.body
            const findUser = await userServices.getUserByLogin(login)
            if (!findUser) {
                res.sendStatus(401).json("Invalid name")
                return
            }

            const isPasswordCorrect = await authServices.checkPassword(password, findUser.accountData.password)
            if (!isPasswordCorrect) {
                res.sendStatus(401).json("Invalid password")
                return
            }

            const token = await authServices.createToken(login);
            res.sendStatus(200).send({token})
            return;

        } catch (error) {
            console.error(error)
        }
    });

authRouter.post('/registration-confirmation',
    body('login').trim().exists().isLength({min: 3, max: 10}),
    body('email').isEmail(),
    body('password').trim().exists().isLength({min: 6, max: 20}),
    inputValidation,
    async (req: Request, res: Response) => {

    const result = await authServices.confirmEmail(req.body.code)
    if(result!) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
});

authRouter.post('/registration-email-resending', async (req: Request, res: Response) => {

});