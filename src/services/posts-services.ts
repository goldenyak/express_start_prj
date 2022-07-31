import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";

export const postsServices = {
    async getAllPosts(pageNumber: number, pageSize: number, bloggerId?: number) {
        const postsData = await postsRepository.getAllPosts(pageNumber, pageSize);
        return {
            pagesCount: Math.ceil(postsData[0] / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsData[0],
            items: [postsData[1]]
        }
    },

    async getPostById(id: number) {
        return postsRepository.getPostById(id)
    },

    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)

        return postsRepository.createNewPost({
            "_id": new ObjectId(),
            "id": Number(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": blogger?.name || ''
        })
    },

    async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number) {
        const bloggerById = await bloggersRepository.getBloggerById(bloggerId)
        if (bloggerById) {
            await postsRepository.updatePostById(id, title, shortDescription, content, bloggerId, bloggerById.name)
        }
        // bloggerById?.name && await postsRepository.updatePostById(id, title, shortDescription, content, bloggerId, bloggerById?.name)
        return
    },

    async deletePostById(id: number) {
        await postsRepository.deletePostById(id)
        return
    }

}