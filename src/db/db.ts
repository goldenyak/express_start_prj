import {MongoClient} from "mongodb";

const mongoUri = process.env.mongoUri || "mongodb://0.0.0.0:27017";
export const client = new MongoClient(mongoUri);

export const bloggersCollection = client.db("express-project").collection<any>("bloggers");
export const postsCollection = client.db("express-project").collection<any>("posts");

export async function runDb() {
    try {
        await client.connect();
        // await client.db("bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        await client.close();
    }
}