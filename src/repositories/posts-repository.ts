import {postsCollection} from "../db/db";

export const postsRepository = {
    async getAllPosts(): Promise<any> {
        return postsCollection.find({}).toArray()
    },
    async getPostsById(id: number | null | undefined): Promise<any> {
        if (id) {
            return postsCollection.findOne({id: id})
        } else {
            return postsCollection.find({}).toArray()
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
        await postsCollection.insertOne(newPost)
        return newPost
    },

    async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<any> {
        const post = await postsRepository.getPostsById(id)

        const updatedPost = postsCollection.updateOne({id: id}, {
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
            return postsCollection.deleteOne({id: id})
        } else {
            return postsCollection.find({}).toArray()
        }
    }
}