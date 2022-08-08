import {commentsCollection} from "../db/db";

export const commentsRepository = {
    async getAllComments() {

    },

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number) {
        return await commentsCollection.find({postId: postId})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .map(comment => {
                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    addedAt: comment.addedAt
                }
            })
            .toArray()
    },

    async countComments(postId: string) {
        return await commentsCollection.countDocuments({postId: postId})
    }
}