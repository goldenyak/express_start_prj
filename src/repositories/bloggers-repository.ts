import {bloggersCollection} from "../db/db";

export const bloggersRepository = {
    async getAllBloggers(pageNumber: number, pageSize: number, searchNameTerm: string | undefined): Promise<any> {

        const filter = searchNameTerm ? {name: {$regex: searchNameTerm}} : {};
        const countOfBloggers = await bloggersCollection.countDocuments(filter);
        const allBloggers = await bloggersCollection
            .find(filter, {projection:{ _id: 0 }})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return [countOfBloggers, allBloggers]
    },

    async getBloggerById(id: number | null | undefined): Promise<any> {
        if (id) {
            return await bloggersCollection.findOne({id: id})
        } else {
            return await bloggersCollection.find({}).toArray()
        }
    },
    async createNewBlogger(newBlogger: any): Promise<any> {

        await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },
    async updateBloggerById(newName: string, newYoutubeUrl: string, id: number): Promise<any> {

        const updatedBlogger = bloggersCollection.updateOne({id: id}, {
            $set: {
                name: newName,
                youtubeUrl: newYoutubeUrl
            }
        })
        return updatedBlogger
    },
    async deleteBloggerById(id: number): Promise<any> {
        if (id) {
            return await bloggersCollection.deleteOne({id: id})
        } else {
            return await bloggersCollection.find({}).toArray()
        }
    }
}