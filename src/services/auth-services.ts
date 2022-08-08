import jwt from "jsonwebtoken";
import {checkAuthToken} from "../middlewares/check-auth-token";
import {usersRepository} from "../repositories/users-repository";
import {generateAccessToken} from "../utils/generateAccessToken";

export const authServices = {
    async checkAuthToken(token: string) {
        interface JwtPayload {
            userId: string
        }

        try {
            const result = jwt.verify(token, "fhdgsmmbxssnxmsnxa") as JwtPayload
            console.log(result.userId)
            return result.userId
        } catch (error) {
            return null
        }
    },


    async createToken(login: string) {
        const findUser = await usersRepository.findUser(login)
        return generateAccessToken(findUser._id);
    },

    async createComment() {

    }
}