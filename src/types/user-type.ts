import {ObjectId} from "mongodb";

export type userType = {
    "_id": ObjectId
    "login": string,
    "password": string
}