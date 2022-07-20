import {bloggers, videos} from "./db";

export const bloggersRepository = {
    getAllBloggers() {
        return bloggers;
    },
    getBloggerById(id: number) {
        return bloggers.find(el => el.id === id)

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
        } else {
            return undefined
        }
        return updatedBlogger
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