import {usersCollection} from "../db/db";

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

    async createNewUser(newUser: any) {
        return await usersCollection.insertOne(newUser)
    },

    async findUser(login: string) {
        return await usersCollection.findOne({login: login})
    },

    async deleteUserById(id: string) {
        return await usersCollection.deleteOne({_id: id});
    },

    async getUserById(id: Promise<string | null>) {
        return await usersCollection.findOne({_id: id})
    }
}