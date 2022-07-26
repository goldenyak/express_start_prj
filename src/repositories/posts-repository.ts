import {bloggers, posts, videos} from "./db";

export const postsRepository = {
    async getAllPosts(): Promise<any> {
        return posts;
    },
    async getPostsById(id: number): Promise<any> {
        return posts.find(el => el.id === id)

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
        posts.push(newPost)
        return newPost
    },

    async updatePostById(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<any> {
        const post =  await postsRepository.getPostsById(id)
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.bloggerId = bloggerId
        }
        else return undefined

        return post
    },

    async deletePostById(id: number): Promise<any> {
        posts.splice(posts.findIndex(item => item.id === id), 1)
        return
    }
}