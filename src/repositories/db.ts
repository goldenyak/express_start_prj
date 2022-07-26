import {MongoClient} from "mongodb";

const mongoUri = process.env.mongoUri || "mongodb://0.0.0.0:27017";
export const client = new MongoClient(mongoUri);

export async function runDb() {
    try {
        await client.connect();
        await client.db("bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server!")
    } catch {
        await client.close();
    }
}


export const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]
// export const bloggers = [
//     {id: 1, name: 'Ivan', youtubeUrl: 'youtube.com/Ivan'},
//     {id: 2, name: 'Egor', youtubeUrl: 'youtube.com/Egor'},
//     {id: 3, name: 'Roma', youtubeUrl: 'youtube.com/Roma'},
//     {id: 4, name: 'Maksim', youtubeUrl: 'youtube.com/Maksim'},
//     {id: 5, name: 'Dima', youtubeUrl: 'youtube.com/Dima'},
//
// ]
// export const posts = [
//     {
//         id: 1,
//         title: "Post 1",
//         shortDescription: "Description for post 1",
//         content: "Content for post 1",
//         bloggerId: 1,
//         bloggerName: "some bloggers name"
//     },
//     {
//         id: 2,
//         title: "Post 2",
//         shortDescription: "Description for post 2",
//         content: "Content for post 2",
//         bloggerId: 2,
//         bloggerName: "some bloggers name"
//     },
//     {
//         id: 3,
//         title: "Post 3",
//         shortDescription: "Description for post 3",
//         content: "Content for post 3",
//         bloggerId: 3,
//         bloggerName: "some bloggers name"
//     }
// ]
// export const errorsMessages: any = {
//     "errorsMessages": []
// };