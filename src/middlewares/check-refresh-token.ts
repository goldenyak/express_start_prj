import {NextFunction, Request, Response} from "express";
import {authServices} from "../services/auth-services";
import {userServices} from "../services/user-services";

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const userId = refreshToken ? await authServices.checkRefreshToken(refreshToken) : null
    if (userId) {
        req.user = await userServices.getUserById(userId)
        next()
        return userId
    }
    res.sendStatus(401)
    return
}
