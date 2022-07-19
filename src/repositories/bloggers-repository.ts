import {bloggers, videos} from "./db";

export const bloggersRepository = {
    getAllBloggers() {
        return bloggers;
    },
    getBloggerById(id: number) {
        const bloggerById = bloggers.find(el => el.id === id)
        return bloggerById
    },
    createNewBlogger() {

    },
    updateBloggerById() {

    },
    deleteBloggerById() {

    }
}