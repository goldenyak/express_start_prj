import {commentsRepository} from "../repositories/comments-repository";
import {usersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from "uuid";
import {commentsType} from "../types/comments-type";
import {ObjectId} from "mongodb";
import {userType} from "../types/user-type";

export const commentsServices = {
    async getAllComments() {

    },

    async getCommentById(id: string) {
        try {
            return await commentsRepository.getCommentById(id)
        } catch (e) {
            return null
        }

    },


    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number) {
        const commentCount = await commentsRepository.countComments(postId)
        const pagesCount = Math.ceil(commentCount / pageSize)
        const commentsByPostId = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": commentCount,
            "items": commentsByPostId
        }
    },

    async createComment(postId: string, content: string, user: userType) {
        const newComment: commentsType = {
            _id: new ObjectId(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.login,
            addedAt: new Date(),
            postId: postId
        }
        const result = await commentsRepository.createComment(newComment)
        if (result.acknowledged) {
            return {
                id: result.insertedId,
                content: newComment.content,
                userId: newComment.userId,
                userLogin: newComment.userLogin,
                addedAt: newComment.addedAt,
            }
        } else {
            throw new Error('Comment posting failed')
        }
    },

    async updateCommentById(commentId: string, content: string) {
        return await commentsRepository.updateCommentById(new ObjectId(commentId), content)
    },

    async deleteComment(commentId: string) {
        return await commentsRepository.deleteComment(new ObjectId(commentId))
    }

}