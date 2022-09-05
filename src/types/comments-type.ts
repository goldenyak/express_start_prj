import {ObjectId} from "mongodb";

export type commentsType = {
    "id": string,
    "content": string,
    "userId": string,
    "userLogin": string,
    "addedAt": Date,
    "postId": string
}