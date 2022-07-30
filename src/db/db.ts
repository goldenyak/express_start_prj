import {MongoClient} from "mongodb";
import 'dotenv/config'
import {postInterface, postsType} from "../types/posts-types";
import {bloggersType} from "../types/bloggers-type";

const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";
export const client = new MongoClient(mongoUri);

export const bloggersCollection = client.db("express-project").collection<bloggersType>("bloggers");
export const postsCollection = client.db("express-project").collection<postsType>("posts");

export async function runDb() {
    try {
        await client.connect();
        // await client.db("bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        await client.close();
    }
}