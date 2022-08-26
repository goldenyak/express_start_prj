import {Request, Response, Router} from "express";
import {userServices} from "../services/user-services";
import {inputValidation} from "../validation/errors/input-validation";
import {authServices} from "../services/auth-services";
import {body, validationResult} from "express-validator";
import {usersRepository} from "../repositories/users-repository";
import {userLoginValidation} from "../validation/users/user-login-validation";
import {userEmailValidation} from "../validation/users/user-email-validation";
import {authMiddleware, isNotSpam} from "../middlewares/auth-middleware";
import {errorsAdapt} from "../utils";
import {checkRefreshToken} from "../middlewares/check-refresh-token";


export const authRouter = Router({});

authRouter.post('/registration',
    isNotSpam('register', 10, 5),
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    body('email').normalizeEmail().isEmail(),
    // body('email').custom(async value => {
    //     if (await userServices.getUserByEmail(value)) {
    //         return Promise.reject();
    //     }
    // }),
    // body('login').custom(async value => {
    //     if (await userServices.getUserByLogin(value)) {
    //         return Promise.reject();
    //     }
    // }),
    inputValidation,
    async (req: Request, res: Response) => {
        const {login, password, email} = req.body
        // const errors = validationResult(req)
        // if (!errors.isEmpty()) {
        //     res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        //     return
        // }
        const createdUser = await authServices.registerUser(login, password, email)
        if (createdUser) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
);

authRouter.post('/login',
    isNotSpam('login', 10, 5),
    body('login').exists().isString(),
    body('password').exists().isString(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        try {
            const {login, password} = req.body
            const findUser = await userServices.getUserByLogin(login)
            if (!findUser) {
                res.status(401).json("Invalid name")
                return
            }
            const isPasswordCorrect = await authServices.checkPassword(password, findUser.accountData.password)
            if (!isPasswordCorrect) {
                res.status(401).json("Invalid password")
                return
            }

            const token = await authServices.createToken(login);
            const refreshToken = await authServices.createRefreshToken(login)
            res.cookie("refreshToken", refreshToken)
            res.status(200).json({"accessToken": token})
            return
        } catch (error) {
            console.error(error)
        }
    });

authRouter.post('/refresh-token',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        const userName = req.user!.accountData.userName
        const refreshToken = await authServices.createRefreshToken(userName)
        res.cookie('refreshToken', refreshToken,
            {
                maxAge: 20000,
                httpOnly: true,
                secure: true
            }
        )
        res.status(200).json({"accessToken": await authServices.createToken(userName)})
    });

authRouter.post('/logout',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        await authServices.deactivateToken(req.cookies.refreshToken)
        res.sendStatus(204)
        return
    })

authRouter.get('/me',
    authMiddleware,
    (req: Request, res: Response) => {
        const user = req.user
        res.status(200).json({
            "email": user?.accountData.email,
            "login": user?.accountData.userName,
            "userId": user?._id
        })
    })

authRouter.post('/registration-confirmation',
    isNotSpam('confirm', 10, 5),
    body('code').custom(async value => {
        const user = await usersRepository.getUserByConfirmationCode(value)
        if (!user || user.emailConfirmation.isConfirmed) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        await usersRepository.confirmUser(req.body.code)
        res.sendStatus(204)
    });

authRouter.post('/registration-email-resending',
    isNotSpam('resend', 10, 5),
    body('email').normalizeEmail().isEmail(),
    body('email').custom(async value => {
        const user = await userServices.getUserByEmail(value)
        if (user === null || (user && user.emailConfirmation.isConfirmed)) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        await authServices.updateConfirmationCode(req.body.email)
        res.sendStatus(204)
    });