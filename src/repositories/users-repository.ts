import {usersCollection} from "../db/db";
import {userType} from "../types/user-type";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async getAllUsers(pageNumber: number, pageSize: number): Promise<[number, Object[]]> {

        const countOfUsers = await usersCollection.countDocuments({});
        const allUsers = await usersCollection
            .find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .map(el => {
                return {id: el._id.toString(), login: el.login}
            })
            .toArray()

        return [countOfUsers, allUsers]
    },

    async createNewUser(newUser: userType) {
        return await usersCollection.insertOne(newUser)
    },

    async findUser(login: string) {
        return await usersCollection.findOne({login: login})
    },

    async deleteUserById(id: ObjectId) {
        return await usersCollection.deleteOne({_id: id});
    },

    async getUserById(filter: ObjectId | string) {
        if(typeof filter === "string") {
            return usersCollection.findOne({"userData.login": filter});
        }
        else {
            return usersCollection.findOne({_id: filter});
        }
    }
}