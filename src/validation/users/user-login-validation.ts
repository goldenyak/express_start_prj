import {Request, Response, NextFunction} from "express";
import {userServices} from "../../services/user-services";

export const userLoginValidation = async (req: Request, res: Response, next:NextFunction) => {
    const userLogin = req.body.login

    if(await userServices.getUserByLogin(userLogin)) {
        res.status(400).json("Данный username уже кем-то занят!")
        return
    } else {
        next()
        return
    }
};