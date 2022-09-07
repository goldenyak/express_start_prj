import {commentsRepository} from "../repositories/comments-repository";
import {commentsType} from "../types/comments-type";
import {ObjectId} from "mongodb";
import {userType} from "../types/user-type";
import {likesRepository} from "../repositories/likes-repository";
import {type} from "os";
import {LikesType} from "../types/likes-type";

export const commentsServices = {

    async getCommentById(id: string) {
        const commentById = await commentsRepository.getCommentById(id)
        if (commentById) {
            return ({
                ...commentById
            })
        } else return null
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
            id: Number(new Date()).toString(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.accountData.userName,
            addedAt: new Date(),
            postId: postId,
            type: "comment"
        }
        await commentsRepository.createComment(newComment)
        return newComment
        // if (result.acknowledged) {
        //     return {
        //         id: result.insertedId,
        //         content: newComment.content,
        //         userId: newComment.userId,
        //         userLogin: newComment.userLogin,
        //         addedAt: newComment.addedAt,
        //     }
        // } else {
        //     throw new Error('Comment posting failed')
        // }
    },

    // async createComment(postId: string, content: string, user: userType) {
    //     const newComment = {
    //         "_id": new ObjectId(),
    //         "id": Number(new Date()).toString(),
    //         "content": content,
    //         "userId": user._id.toString(),
    //         "userLogin": user.accountData.userName,
    //         "addedAt": new Date(),
    //         "postId": postId
    //     }
    //     return await commentsRepository.createComment(newComment)
    // },

    async updateCommentById(commentId: string, content: string) {
        return await commentsRepository.updateCommentById(new ObjectId(commentId), content)
    },

    async deleteComment(commentId: string) {
        return await commentsRepository.deleteComment(new ObjectId(commentId))
    },

    async setLikeStatus(commentId: string, likeStatus: string, user: userType) {

        const newLike: LikesType = {
            "type": "comment",
            "parrentId": commentId,
            "likeStatus": likeStatus,
            "user": user.accountData.userName,
        }
        const currentLikeStatus = await likesRepository.getLikesByCommentId(commentId)

        if (!currentLikeStatus) {
            return await likesRepository.setLikeStatus(newLike)
        } else {
            return await likesRepository.updateLikeStatus(commentId, likeStatus)
        }
    }
}