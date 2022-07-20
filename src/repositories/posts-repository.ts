import {bloggers, posts, videos} from "./db";

export const postsRepository = {
    getAllPosts() {
        return posts;
    },
    getPostsById(id: number) {
        return posts.find(el => el.id === id)

    },
    createNewPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string) {
        const newPost = {
            "id": +(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": bloggerName

        }
        posts.push(newPost)
        return newPost
    },

    updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number) {
        const post = postsRepository.getPostsById(id)
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.bloggerId = bloggerId
        }
        else return undefined

        return post
    },

    deletePostById(id: number) {
        posts.splice(posts.findIndex(item => item.id === id), 1)
        return
    }
}