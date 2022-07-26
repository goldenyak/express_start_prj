// import {bloggers} from "./db";

import {client} from "./db";

export type bloggersType = {
    "id": number,
    "name": string,
    "youtubeUrl": string
}

export const bloggersRepository = {
    async getAllBloggers(SearchNameTerm: string): Promise<bloggersType[]> {
        return client.db("express-project").collection<bloggersType>("bloggers").find({name: {$regex: SearchNameTerm}}).toArray()
        // return client.db("express-project").collection<bloggersType>("bloggers").find({}).toArray()
    },
    async getBloggerById(id: number | null | undefined): Promise<any> {
        if (id) {
            return client.db("express-project").collection("bloggers").findOne({id: id})
        } else {
            return client.db("express-project").collection("bloggers").find({}).toArray()

        }
    },
    async createNewBlogger(name: string, youtubeUrl: string): Promise<bloggersType> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        await client.db("express-project").collection<bloggersType>("bloggers").insertOne(newBlogger)
        return newBlogger
    },
    async updateBloggerById(newName: string, newYoutubeUrl: string, id: number): Promise<any> {

        const updatedBlogger = client.db("express-project").collection<bloggersType>("bloggers").updateOne({id: id}, {
            $set: {
                name: newName,
                youtubeUrl: newYoutubeUrl
            }
        })
        return updatedBlogger
    },
    async deleteBloggerById(id: number): Promise<any> {
        if (id) {
            return client.db("express-project").collection("bloggers").deleteOne({id: id})
        } else {
            return client.db("express-project").collection("bloggers").find({}).toArray()
        }
    }
}