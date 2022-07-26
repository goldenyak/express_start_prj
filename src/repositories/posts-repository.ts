import {client} from "./db";

export const postsRepository = {
    async getAllPosts(): Promise<any> {
        return client.db("express-project").collection("posts").find({}).toArray()
    },
    async getPostsById(id: number | null | undefined): Promise<any> {
        if (id) {
            return client.db("express-project").collection("posts").findOne({id: id})
        } else {
            return client.db("express-project").collection("posts").find({}).toArray()
        }
    },
    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<any> {
        const newPost = {
            "id": +(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": bloggerName

        }
        await client.db("express-project").collection("posts").insertOne(newPost)
        return newPost
    },

    async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<any> {
        const post = await postsRepository.getPostsById(id)

        const updatedPost = client.db("express-project").collection("posts").updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId
            }
        })
        return updatedPost
    },

    async deletePostById(id: number): Promise<any> {
        if (id) {
            return client.db("express-project").collection("posts").deleteOne({id: id})
        } else {
            return client.db("express-project").collection("posts").find({}).toArray()
        }
    }
}