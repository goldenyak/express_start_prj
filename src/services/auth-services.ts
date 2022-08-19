import jwt from "jsonwebtoken";
import {usersRepository} from "../repositories/users-repository";
import {userServices} from "./user-services";
import bcrypt from "bcrypt";
import {usersCollection} from "../db/db";
import {emailAdapter} from "../adapters/emailAdapter";


export const authServices = {

    async registerUser(login: string, password: string, email: string) {
        try {
            const createdUser = await userServices.createNewUser(login, password, email)
            if (createdUser) {
                const newUser = await userServices.getUserByLogin(createdUser.login)
                const confirmEmail = await emailAdapter.sendEmail(email, `${newUser?.emailConfirmation.confirmationCode}`)
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

    async checkEmail(email: string) {
        return await usersCollection.findOne({"accountData.email": email})
    },

    async confirmEmail(code: string) {
        const user = await userServices.getUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        const result = await usersRepository.updateConfirmation(user._id)
        return result
    },

    async checkAuthToken(token: string) {
        try {
            const result: any = jwt.verify(token, "fhdgsmmbxssnxmsnxa")
            return result.userId
        } catch (error) {
            return null
        }
    },

    async createToken(login: string) {
        const findUser = await usersRepository.getUserByLogin(login)
        if (findUser) {
            const token = jwt.sign({userId: findUser._id}, "fhdgsmmbxssnxmsnxa", {expiresIn: "1h"})
            return token
        }
    },
}