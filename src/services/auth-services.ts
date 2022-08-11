import jwt from "jsonwebtoken";
import {checkAuthToken} from "../middlewares/check-auth-token";
import {usersRepository} from "../repositories/users-repository";
import {generateAccessToken} from "../utils/generateAccessToken";
import {ObjectId} from "mongodb";

export const authServices = {
    async checkAuthToken(token: string) {
        try {
            const result: any = jwt.verify(token, "fhdgsmmbxssnxmsnxa")
            console.log(result.userId)
            return result.userId
        } catch (error) {
            return null
        }
    },


    async createToken(login: string) {
        const findUser = await usersRepository.findUser(login)
        if (findUser) {
            debugger
            const token =  jwt.sign({userId: findUser._id}, "fhdgsmmbxssnxmsnxa", {expiresIn: "1h"})
            return token
        }
    },

    async createComment() {

    }
}