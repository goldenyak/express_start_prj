import {bloggersCollection} from "../db/db";
import {bloggersType} from "../types/bloggers-type";

export const bloggersRepository = {
    async getAllBloggers(pageNumber: number, pageSize: number, searchNameTerm: string | undefined):Promise<[number, Object[]]> {

        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'ig'}} : {};
        const countOfBloggers = await bloggersCollection.countDocuments(filter);
        const allBloggers = await bloggersCollection
            .find(filter, {projection:{ _id: 0 }})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return [countOfBloggers, allBloggers]
    },

    async getBloggerById(id: number) {
        const filter = {id: id}
        const blogger = await bloggersCollection.findOne(filter, {projection:{ _id: 0 }})
        return blogger
    },
    async createNewBlogger(newBlogger: bloggersType) {

        await bloggersCollection.insertOne(newBlogger)
        return {
            "id": newBlogger.id,
            "name": newBlogger.name,
            "youtubeUrl": newBlogger.youtubeUrl
        }
    },
    async updateBloggerById(newName: string, newYoutubeUrl: string, id: number) {

        const updatedBlogger = bloggersCollection.updateOne({id: id}, {
            $set: {
                name: newName,
                youtubeUrl: newYoutubeUrl
            }
        })
        return updatedBlogger
    },
    async deleteBloggerById(id: number) {
        if (id) {
            return await bloggersCollection.deleteOne({id: id})
        } else {
            return await bloggersCollection.find({}).toArray()
        }
    }
}