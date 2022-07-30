import {ObjectId} from "mongodb";

export type bloggersType = {
    "_id": ObjectId,
    "id": number,
    "name": string,
    "youtubeUrl": string
}