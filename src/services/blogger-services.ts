import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggerServices = {
    async getAllBloggers(pageNumber: number, pageSize: number, searchNameTerm: string | undefined) {
        const bloggersItem = await bloggersRepository.getAllBloggers(pageNumber, pageSize, searchNameTerm);
        return {
            pagesCount: Math.ceil(bloggersItem[0] / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: bloggersItem[0],
            items: [bloggersItem[1]]
        }
    },

    async getBloggerById(id: number | null | undefined) {
        const foundedBlogger = await bloggersRepository.getBloggerById(id)
        return foundedBlogger
    },

    async createNewBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        return await bloggersRepository.createNewBlogger(newBlogger)
    },

    async updateBloggerById(newName: string, newYoutubeUrl: string, id: number) {
        return await bloggersRepository.updateBloggerById(newName, newYoutubeUrl, id)
    },

    async deleteBloggerById(id: number) {
        return await bloggersRepository.deleteBloggerById(id)
    },

    async getBloggerPosts(pageNumber: number, pageSize: number, bloggerId: number) {

    }
}