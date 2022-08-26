import {NextFunction, Request, Response} from "express";
import {authServices} from "../services/auth-services";
import {userServices} from "../services/user-services";
import sub from "date-fns/sub"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const authType: string | undefined = req.headers.authorization?.split(" ")[0].toString() || undefined
    const authPhrase: string = req.headers.authorization?.split(" ")[1].toString()

    //Basic auth
    if (authType === 'Basic') {
        if (authPhrase === 'YWRtaW46cXdlcnR5') {
            next()
            return
        } else {
            res.sendStatus(401)
            return
        }
    }

    // JWT auth
    if (authType === 'Bearer') {
        const userId = await authServices.checkAuthToken(authPhrase)
        if (userId) {
            req.user = await userServices.getUserById(userId)
            next()
            return
        }
    }
    res.sendStatus(401)
    return
}

export const isNotSpam = (requestName: string, timeLimit: number = 10, attemptsLimit: number = 5) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const logs = userServices.getRequests(requestName, req.ip, sub(new Date(), {seconds: timeLimit}))
        if(!logs || logs.length < attemptsLimit) {
            userServices.logRequest(requestName, req.ip, new Date())
            next()
            return
        } else {
            res.sendStatus(429)
            return
        }
    }
}
