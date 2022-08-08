import {commentsRepository} from "../repositories/comments-repository";
import {usersRepository} from "../repositories/users-repository";

export const commentsServices = {
    async getAllComments() {

    },

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number) {
        const commentCount = await commentsRepository.countComments(postId)
        const pagesCount = Math.ceil(commentCount/pageSize)
        const commentsByPostId = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": commentCount,
            "items": commentsByPostId
        }
    },

    async createComment( postId: string, content: string, user: any) {

    }
}