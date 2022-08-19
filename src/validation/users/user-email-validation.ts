import {Request, Response, NextFunction} from "express";
import {userServices} from "../../services/user-services";

export const userEmailValidation = async (req: Request, res: Response, next:NextFunction) => {
    const userEmail = req.body.email

    if(await userServices.getUserByEmail(userEmail)) {
        res.status(400).json("Данный email уже используется!")
        return
    } else {
        next()
        return
    }
};