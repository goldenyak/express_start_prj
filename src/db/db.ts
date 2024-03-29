import {MongoClient} from "mongodb";
import 'dotenv/config'
import {postsType} from "../types/posts-types";
import {bloggersType} from "../types/bloggers-type";
import {userType} from "../types/user-type";
import {commentsType} from "../types/comments-type";

const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";
export const client = new MongoClient(mongoUri);

export const bloggersCollection = client.db("express-project").collection<bloggersType>("bloggers");
export const postsCollection = client.db("express-project").collection<postsType>("posts");
export const usersCollection = client.db("express-project").collection<userType>("users");
export const commentsCollection = client.db("express-project").collection<commentsType>("comments");
export const refreshTokensCollection = client.db("express-project").collection<any>("refreshTokens");
export const likesCollection = client.db("express-project").collection<any>("likes");

export async function runDb() {
    try {
        await client.connect();
        // await client.db("bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        await client.close();
    }
}