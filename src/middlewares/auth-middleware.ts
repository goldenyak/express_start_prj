import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const authType: string | undefined = req.headers.authorization?.split(" ")[0].toString() || undefined
    const authPhrase: string = req.headers.authorization?.split(" ")[1].toString()
    //Basic auth
    if (authType === 'Basic') {
        const authorized = authPhrase === 'YWRtaW46cXdlcnR5'
        authorized && next()
        return
    // const authorized: boolean = req.headers.authorization?.split(" ")[1].toString() === 'YWRtaW46cXdlcnR5'
    // const authType: string = req.headers.authorization?.split(" ")[0].toString() || 'no auth'
    //
    // if (req.headers.authorization && authType === 'Basic' && authorized === true) {
    //     next()
    //     return;
    // } else {
    //     res.sendStatus(401)
    //     return;
    }


    if (req.headers["content-type"] === "application/json") {
        next()
    } else {
        res.status(400).send("Bad content type")
        res.end()
        return;
    }
}