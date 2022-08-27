import jwt from "jsonwebtoken";
import {usersRepository} from "../repositories/users-repository";
import {userServices} from "./user-services";
import bcrypt from "bcrypt";
import {emailAdapter} from "../adapters/emailAdapter";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {tokensRepository} from "../repositories/tokens-repository";
import {RefreshTokensType} from "../types/refresh-tokens-type";


export const authServices = {

    async registerUser(login: string, password: string, email: string) {
        try {
            const createdUser = await userServices.createNewUser(login, password, email)
            if (createdUser) {
                const newUser = await userServices.getUserByLogin(createdUser.login)
                const confirmEmail = await emailAdapter.sendEmail(
                    newUser?.accountData.email,
                    `https://express-start-prj.herokuapp.com/auth/registration-confirmation?code=${newUser?.emailConfirmation.confirmationCode}`
                )
                if (confirmEmail === "250") {
                    return true
                } else {
                    return null
                }
            }
            return createdUser
        } catch (error) {
            return undefined
        }
    },

    async checkPassword(password: string, passwordByFindUser: string) {
        return await bcrypt.compare(password, passwordByFindUser);
    },

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10)
    },

    async checkAuthToken(token: string) {
        try {
            const result: any = jwt.verify(token, "fhdgsmmbxssnxmsnxa")
            return result.userId
        } catch (error) {
            return null
        }
    },

    async checkRefreshToken(refreshToken: string) {
        const result: any = jwt.verify(refreshToken, "hgghdgfhd")
        const currentToken = await tokensRepository.getToken(refreshToken)
        if (currentToken.expiresIn > new Date()) {
            await tokensRepository.deactivateToken(refreshToken)
            return result.userId
        } else {
            return false
        }
    },

    async createToken(login: string) {
        const findUser = await usersRepository.getUserByLogin(login)
        if (findUser) {
            const token = jwt.sign({userId: findUser._id}, "fhdgsmmbxssnxmsnxa", {expiresIn: "10s"})
            return token
        }
    },

    async createRefreshToken(login: string) {
        const findUser = await usersRepository.getUserByLogin(login)
        if (findUser) {
            const refreshToken = jwt.sign({userId: findUser._id}, "hgghdgfhd", {expiresIn: "20s"})

            const newRefreshToken: RefreshTokensType = {
                _id: new ObjectId(),
                token: refreshToken,
                isValid: true,
                expiresIn: add(new Date(), {
                    seconds: 20
                }),
                user: findUser._id.toString()
            }

            await tokensRepository.addNewRefreshToken(newRefreshToken)
            return refreshToken
        }
    },

    async deactivateToken(refreshToken: string) {
        await tokensRepository.deactivateToken(refreshToken)
    },

    async updateConfirmationCode(email: string) {
        const code = await userServices.updateUserConfirmationCode(email)
        try {
            return await emailAdapter.sendEmail(email, `https://express-start-prj.herokuapp.com/auth/registration-confirmation?code=${code}`)
        } catch (e) {
            throw e
        }
    }
}