import {bloggers, videos} from "./db";

export const bloggersRepository = {
    getAllBloggers() {
        return bloggers;
    },
    getBloggerById(id: number) {
        const bloggerById = bloggers.find(el => el.id === id)
        return bloggerById
    },
    createNewBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger
    },
    updateBloggerById(newName: string, newYoutubeUrl: string, id: number) {
        const updatedBlogger = bloggers.find(el => el.id === id)
        if (updatedBlogger) {
            updatedBlogger.name = newName
            updatedBlogger.youtubeUrl = newYoutubeUrl
            return true
        } else return false;

        // for (let i = 0; i < bloggers.length; i++) {
        //     if (bloggers[i].id === id) {
        //         bloggers[i].name = newName
        //         bloggers[i].youtubeUrl = newYoutubeUrl
        //         return
        //     }
        // }
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