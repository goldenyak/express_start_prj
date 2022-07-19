import {bloggers, videos} from "./db";

export const bloggersRepository = {
    getAllBloggers() {
        return bloggers;
    },
    getBloggerById(id: number) {
        const bloggerById = bloggers.find(el => el.id === id)
        if (bloggerById) {
            return true
        } else {
            return false
        }
    },
    createNewBlogger() {

    },
    updateBloggerById() {

    },
    deleteBloggerById() {

    }
}