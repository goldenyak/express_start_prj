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
    deleteBloggerById(id: number) {
        const beforeDeliting = bloggers.length

        for (let i = 0; i < bloggers.length; i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1)
            }
        }
        return beforeDeliting > bloggers.length
    }
}