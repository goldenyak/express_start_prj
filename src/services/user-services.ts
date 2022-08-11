import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";

export const userServices = {
    async getAllUsers(pageNumber: number, pageSize: number) {
        const usersData = await usersRepository.getAllUsers(pageNumber, pageSize)
        const usersCount = Math.ceil(usersData[0] / pageSize)

        return {
            "pagesCount": usersCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": usersData[0],
            "items": usersData[1]
        }
    },

    async createNewUser(login: string, password: string) {
        const hashPassword = bcrypt.hashSync(password, 10)

        const newUser = await usersRepository.createNewUser({
            _id: new ObjectId(),
            login: login,
            password: hashPassword
        })

        if (newUser.insertedId) {
            return {
                "id": newUser.insertedId.toString(),
                "login": login,
            }
        } else {
            return null
        }
    },

    async findUser(login: string) {
        return await usersRepository.findUser(login)
    },

    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(new ObjectId(id))
    },

    async getUserById(id: string) {
        try {
            return await usersRepository.getUserById(new ObjectId(id))
            // return await usersRepository.getUserById(id)
        } catch (error) {
            return null
        }
    },

    async checkPassword(login: string, password: string) {
        const findUser = await usersRepository.findUser(login)
        return bcrypt.compareSync(password, findUser!.password)
    },

}