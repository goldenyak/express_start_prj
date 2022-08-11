import {postsCollection} from "../db/db";
import {postsType} from "../types/posts-types";

export const postsRepository = {
    async getAllPosts(pageNumber: number, pageSize: number, bloggerId?: string): Promise<[number, Object[]]> {
        const filter = bloggerId ? {bloggerId: bloggerId} : {}

        const countOfPosts = await postsCollection.countDocuments(filter);

        const posts = await postsCollection
            .find(filter, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return [countOfPosts, posts]
    },
    async getPostById(id: string) {

        const filter = {id: id}
        return await postsCollection.findOne(filter, {projection: {_id: 0}})

        // const findPost = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        // return findPost
    },
    async createNewPost(post: postsType) {
        try {
            await postsCollection.insertOne(post)
            return {
                "id": post.id,
                "title": post.title,
                "shortDescription": post.shortDescription,
                "content": post.content,
                "bloggerId": post.bloggerId,
                "bloggerName": post.bloggerName
            }
        } catch (error) {
            console.error(error)
        }
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string) {
        const post = await postsRepository.getPostById(id)

        const updatedPost = postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: bloggerName
            }
        })
        return updatedPost;
    },

    async deletePostById(id: string) {

        await postsCollection.deleteOne({id: id})
        return
    }
}