import {videos} from "./db";

export const videosRepository = {
    getVideos() {
        return videos;
    },
    getVideoById(videoId: number) {
        const videoById = videos.find(el => el.id === videoId)
        if (videoById) {
            return videoById;
        } else {
            return ("not video")
        }
    },
    deleteVideoById(id: number) {
        // if (videos.filter(el => el.id !== id)) {
        //     // res.sendStatus(404)
        //     return ("Видео по id не найдено");
        // }
        const beforeDeliting = videos.length // 5

        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1)
            }
        }
        return beforeDeliting > videos.length
    },
    updateVideoById(id: number, title: string) {
        const updatedVideo = videos.find(el => el.id === id)
        if (updatedVideo) {
            updatedVideo.title = title
            return true
        } else return false;
    },

    createVideo(title: string) {
        // if (!title || !title.trim() || title.length > 40) {
        //     res.status(400).send({
        //         "errorsMessages": [
        //             {
        //                 "message": "string",
        //                 "field": "title"
        //             }
        //         ]
        //     })
        //     return;
        // }

        const newVideo = {
            id: +(new Date()),
            title: title,
            author: "Egor Yakovlev"
        }
        videos.push(newVideo)
        return newVideo
    }
}